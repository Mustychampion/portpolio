import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.1";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Server-side validation schema
const newsletterSchema = z.object({
  email: z.string().trim().email().max(255),
});

interface NewsletterRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawData: NewsletterRequest = await req.json();

    // Validate input server-side
    const validationResult = newsletterSchema.safeParse(rawData);
    
    if (!validationResult.success) {
      console.error("Validation failed:", validationResult.error.errors);
      return new Response(
        JSON.stringify({ 
          error: "Invalid email address",
          details: validationResult.error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { email } = validationResult.data;

    console.log("Processing newsletter subscription");

    // Initialize Supabase client with service role key for database access
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check if email already exists
    const { data: existing } = await supabaseClient
      .from("newsletter_subscriptions")
      .select("email, status")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      if (existing.status === "active") {
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "You are already subscribed to our newsletter!" 
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      } else {
        // Reactivate subscription
        await supabaseClient
          .from("newsletter_subscriptions")
          .update({ status: "active", subscribed_at: new Date().toISOString() })
          .eq("email", email);
        
        console.log("Reactivated subscription");
      }
    } else {
      // Store new subscription in database
      const { error: dbError } = await supabaseClient
        .from("newsletter_subscriptions")
        .insert({ email });

      if (dbError) {
        console.error("Database error:", dbError);
        throw new Error("Failed to save subscription");
      }

      console.log("New subscription saved to database");
    }

    // Send welcome email
    const emailResponse = await resend.emails.send({
      from: "JM Square <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to JM Square Kitchen Utensils Newsletter!",
      html: `
        <h1>Welcome to JM Square!</h1>
        <p>Thank you for subscribing to our newsletter.</p>
        <p>You'll now receive:</p>
        <ul>
          <li>Exclusive deals and discounts</li>
          <li>New product alerts</li>
          <li>Kitchen tips and tricks</li>
        </ul>
        <p>We respect your privacy and you can unsubscribe at any time.</p>
        <br>
        <p>Best regards,<br>The JM Square Team</p>
      `,
    });

    console.log("Welcome email sent:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Successfully subscribed to newsletter!" 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in subscribe-newsletter function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
