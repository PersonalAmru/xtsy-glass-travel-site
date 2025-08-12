-- Secure RLS for bookings table: restrict public access and allow per-user access
BEGIN;

-- Drop overly permissive policies if they exist
DROP POLICY IF EXISTS "Allow all for anonymous" ON public.bookings;
DROP POLICY IF EXISTS "Allow all for authenticated" ON public.bookings;
DROP POLICY IF EXISTS "Allow all for service_role" ON public.bookings;

-- Ensure RLS is enabled
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Helper function to safely read the JWT email claim
CREATE OR REPLACE FUNCTION public.get_jwt_email()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT NULLIF((current_setting('request.jwt.claims', true))::json ->> 'email', '')::text;
$$;

-- Allow anyone (including anonymous) to create a booking
-- This preserves current UX where guests can submit booking requests without authentication
CREATE POLICY "Anyone can create a booking"
ON public.bookings
FOR INSERT
WITH CHECK (true);

-- Allow authenticated users to view ONLY their own bookings based on email claim
CREATE POLICY "Users can view their own bookings"
ON public.bookings
FOR SELECT
USING (
  public.get_jwt_email() IS NOT NULL
  AND email = public.get_jwt_email()
);

-- Explicitly allow service role full access (edge functions, webhooks)
CREATE POLICY "Service role full access to bookings"
ON public.bookings
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

COMMIT;