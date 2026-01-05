-- Fix bookings RLS policies - remove the one that references auth.users
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;

-- Update the other user policy to use JWT claims instead of auth.users table
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;

-- Create a single clean policy for users to view their own bookings
-- Uses JWT claims from the token to match email, avoiding direct auth.users access
CREATE POLICY "users_view_own_bookings" ON public.bookings
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() 
  OR email = COALESCE((current_setting('request.jwt.claims', true)::json ->> 'email'), '')
);

-- Also fix the update policy to be simpler
DROP POLICY IF EXISTS "bookings_authenticated_owner_update" ON public.bookings;
CREATE POLICY "users_update_own_bookings" ON public.bookings
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Simplify the select policy for authenticated users
DROP POLICY IF EXISTS "bookings_authenticated_users_view_own" ON public.bookings;