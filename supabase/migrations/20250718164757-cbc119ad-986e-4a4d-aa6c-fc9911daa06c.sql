-- Fix the SELECT policy to remove auth.users access
DROP POLICY IF EXISTS "Users can view bookings by email" ON public.bookings;

CREATE POLICY "Users can view bookings by email" 
ON public.bookings 
FOR SELECT 
USING (
  -- Allow viewing if email matches (works for both anonymous and authenticated users)
  email = COALESCE(
    (current_setting('request.jwt.claims'::text, true))::json ->> 'email'::text,
    ''
  )
);