-- Fix bookings table RLS policies to allow authenticated users to view their own bookings
-- This resolves the "Bookings table completely blocks all SELECT queries" security issue

-- First, drop the restrictive deny-all policy
DROP POLICY IF EXISTS bookings_deny_select ON public.bookings;

-- Allow authenticated users to view their own bookings (matched by user_id or email)
CREATE POLICY bookings_users_view_own ON public.bookings
FOR SELECT TO authenticated
USING (
  user_id = auth.uid() OR 
  LOWER(TRIM(email)) = LOWER(TRIM(COALESCE(auth.jwt()->>'email', '')))
);

-- Allow service role full SELECT access for backend operations
CREATE POLICY bookings_service_role_select ON public.bookings
FOR SELECT TO service_role
USING (true);

-- Ensure anonymous users cannot view bookings
CREATE POLICY bookings_deny_anonymous_select ON public.bookings
FOR SELECT TO anon
USING (false);