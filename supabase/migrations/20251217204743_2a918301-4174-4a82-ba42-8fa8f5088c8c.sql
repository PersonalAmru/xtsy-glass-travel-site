-- Strengthen bookings table RLS policies
-- Replace fragile deny-based model with explicit authentication requirements

-- Drop the fragile deny policies that rely on 'false' conditions
DROP POLICY IF EXISTS "bookings_deny_anonymous_select" ON public.bookings;
DROP POLICY IF EXISTS "bookings_deny_delete" ON public.bookings;
DROP POLICY IF EXISTS "bookings_deny_update" ON public.bookings;

-- Update user SELECT policy to explicitly require authentication
DROP POLICY IF EXISTS "bookings_users_view_own" ON public.bookings;
CREATE POLICY "bookings_authenticated_users_view_own" 
ON public.bookings 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Update user UPDATE policy to explicitly require authentication  
DROP POLICY IF EXISTS "bookings_owner_update" ON public.bookings;
CREATE POLICY "bookings_authenticated_owner_update"
ON public.bookings
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Ensure admin policy is properly scoped
DROP POLICY IF EXISTS "bookings_admin_full_access" ON public.bookings;
CREATE POLICY "bookings_admin_full_access"
ON public.bookings
FOR ALL
TO authenticated
USING (
  (get_user_role() = ANY (ARRAY['admin'::text, 'staff'::text])) 
  OR (auth.role() = 'service_role'::text)
)
WITH CHECK (
  (get_user_role() = ANY (ARRAY['admin'::text, 'staff'::text])) 
  OR (auth.role() = 'service_role'::text)
);

-- Allow service_role for backend operations (edge functions)
CREATE POLICY "bookings_service_role_full_access"
ON public.bookings
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);