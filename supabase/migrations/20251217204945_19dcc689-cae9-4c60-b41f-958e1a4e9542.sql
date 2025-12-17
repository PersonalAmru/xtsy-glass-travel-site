-- Add explicit deny policies for anonymous/public access to bookings table
-- This ensures no unauthenticated access is possible

-- Deny anonymous SELECT
CREATE POLICY "bookings_deny_anonymous_select"
ON public.bookings
FOR SELECT
TO anon
USING (false);

-- Deny anonymous INSERT
CREATE POLICY "bookings_deny_anonymous_insert"
ON public.bookings
FOR INSERT
TO anon
WITH CHECK (false);

-- Deny anonymous UPDATE
CREATE POLICY "bookings_deny_anonymous_update"
ON public.bookings
FOR UPDATE
TO anon
USING (false)
WITH CHECK (false);

-- Deny anonymous DELETE
CREATE POLICY "bookings_deny_anonymous_delete"
ON public.bookings
FOR DELETE
TO anon
USING (false);