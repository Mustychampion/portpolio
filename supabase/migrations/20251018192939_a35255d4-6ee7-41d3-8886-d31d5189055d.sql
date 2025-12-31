-- Create table for contact form submissions
CREATE TABLE public.contact_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'new',
  CONSTRAINT contact_submissions_name_check CHECK (char_length(name) <= 100),
  CONSTRAINT contact_submissions_email_check CHECK (char_length(email) <= 255),
  CONSTRAINT contact_submissions_phone_check CHECK (char_length(phone) <= 20),
  CONSTRAINT contact_submissions_message_check CHECK (char_length(message) <= 1000)
);

-- Enable Row Level Security
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view all submissions (we'll set up admin roles separately)
-- For now, allow service role to access all data (edge functions will use this)
CREATE POLICY "Service role can manage all submissions"
ON public.contact_submissions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create table for newsletter subscriptions
CREATE TABLE public.newsletter_subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  subscribed_at timestamp with time zone NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'active',
  CONSTRAINT newsletter_subscriptions_email_check CHECK (char_length(email) <= 255)
);

-- Enable Row Level Security
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy for service role access
CREATE POLICY "Service role can manage all subscriptions"
ON public.newsletter_subscriptions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create index for faster email lookups
CREATE INDEX idx_newsletter_email ON public.newsletter_subscriptions(email);