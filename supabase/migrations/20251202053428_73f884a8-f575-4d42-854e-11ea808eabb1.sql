-- Create table for GDPR-compliant location tracking (only country code, no IP addresses)
CREATE TABLE IF NOT EXISTS public.user_location_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code TEXT NOT NULL,
  detected_currency TEXT NOT NULL,
  detected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_location_preferences ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (for first-time visitors)
CREATE POLICY "Allow anonymous location detection inserts" 
ON public.user_location_preferences 
FOR INSERT 
TO anon
WITH CHECK (true);

-- Create policy to prevent reading (privacy protection)
CREATE POLICY "No read access to location data" 
ON public.user_location_preferences 
FOR SELECT 
USING (false);

-- Create index for analytics queries (admin only, via service role)
CREATE INDEX idx_user_location_country ON public.user_location_preferences(country_code);
CREATE INDEX idx_user_location_detected_at ON public.user_location_preferences(detected_at);

-- Add comment explaining GDPR compliance
COMMENT ON TABLE public.user_location_preferences IS 'GDPR-compliant location tracking: stores only country code and detected currency for analytics. No IP addresses or PII stored. Users can override with manual currency selection.';