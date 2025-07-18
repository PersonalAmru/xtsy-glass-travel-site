-- Fix RLS policy to allow anonymous bookings
DROP POLICY IF EXISTS "Authenticated users can create bookings" ON public.bookings;

-- Create new policy that allows anonymous users to create bookings
CREATE POLICY "Anyone can create bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (true);

-- Update the SELECT policy to also allow anonymous users to view bookings by email
DROP POLICY IF EXISTS "Users can view bookings by email" ON public.bookings;

CREATE POLICY "Users can view bookings by email" 
ON public.bookings 
FOR SELECT 
USING (
  -- Allow viewing if email matches (for anonymous users) or if authenticated user's email matches
  email = COALESCE(
    (current_setting('request.jwt.claims'::text, true))::json ->> 'email'::text,
    ''
  ) 
  OR 
  -- Allow admin access
  auth.uid() IN ( 
    SELECT users.id
    FROM auth.users
    WHERE (users.email)::text = 'admin@xtsy.one'::text
  )
);