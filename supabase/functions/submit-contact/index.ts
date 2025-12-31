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
const contactSchema = z.object({
  name: z.string().trim().min(1).max(100).regex(/^[a-zA-Z\s'-]+$/, "Name must contain only letters, spaces, hyphens, and apostrophes"),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(20).regex(/^[0-9+\-\s()]*$/, "Phone must contain only numbers and standard phone characters").optional().or(z.literal("")),
  message: z.string().trim().min(1).max(1000),
});

interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

// HTML escape function to prevent XSS
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return text.replace(/[&<>"'/]/g, (char) => map[char]);
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawData: ContactRequest = await req.json();

    // Validate input server-side
    const validationResult = contactSchema.safeParse(rawData);
    
    if (!validationResult.success) {
      console.error("Validation failed:", validationResult.error.errors);
      return new Response(
        JSON.stringify({ 
          error: "Invalid input data",
          details: validationResult.error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { name, email, phone, message } = validationResult.data;

    console.log("Processing contact submission");

    // Initialize Supabase client with service role key for database access
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Store in database
    const { data: submission, error: dbError } = await supabaseClient
      .from("contact_submissions")
      .insert({
        name,
        email,
        phone: phone || null,
        message,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to save submission");
    }

    console.log("Submission saved to database:", submission.id);

    // Sanitize user input for HTML emails
    const safeName = escapeHtml(name);
    const safeMessage = escapeHtml(message);
    const safePhone = phone ? escapeHtml(phone) : "Not provided";

    // Send confirmation email to customer
    const customerEmail = await resend.emails.send({
      from: "JM Square <onboarding@resend.dev>",
      to: [email],
      subject: "Thank you for contacting JM Square Kitchen Utensils",
      html: `
        <h1>Thank you for reaching out, ${safeName}!</h1>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <h3>Your Message:</h3>
        <p>${safeMessage}</p>
        <br>
        <p>Best regards,<br>The JM Square Team</p>
      `,
    });

    console.log("Confirmation email sent to customer:", customerEmail);

    // Send notification email to business owner
    // TODO: Replace with your actual business email
    const notificationEmail = await resend.emails.send({
      from: "JM Square Notifications <onboarding@resend.dev>",
      to: ["onboarding@resend.dev"], // Replace with your business email
      subject: `New Contact Form Submission from ${safeName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${safePhone}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
        <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
      `,
    });

    console.log("Notification email sent to business:", notificationEmail);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Submission received successfully",
        id: submission.id 
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
    console.error("Error in submit-contact function:", error);
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
