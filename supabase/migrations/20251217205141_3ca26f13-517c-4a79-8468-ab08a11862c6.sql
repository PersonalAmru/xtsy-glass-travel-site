-- Strengthen bookings RLS policies to verify ownership through both user_id AND email
-- This prevents unauthorized access even if user_id is somehow compromised

-- Drop existing user SELECT policy
DROP POLICY IF EXISTS "bookings_authenticated_users_view_own" ON public.bookings;

-- Create stronger SELECT policy that verifies both user_id AND email
CREATE POLICY "bookings_authenticated_users_view_own"
ON public.bookings
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() 
  AND LOWER(email) = LOWER(COALESCE((current_setting('request.jwt.claims', true)::json->>'email')::text, ''))
);

-- Drop existing user UPDATE policy
DROP POLICY IF EXISTS "bookings_authenticated_owner_update" ON public.bookings;

-- Create stronger UPDATE policy that verifies both user_id AND email
CREATE POLICY "bookings_authenticated_owner_update"
ON public.bookings
FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid()
  AND LOWER(email) = LOWER(COALESCE((current_setting('request.jwt.claims', true)::json->>'email')::text, ''))
)
WITH CHECK (
  user_id = auth.uid()
  AND LOWER(email) = LOWER(COALESCE((current_setting('request.jwt.claims', true)::json->>'email')::text, ''))
);