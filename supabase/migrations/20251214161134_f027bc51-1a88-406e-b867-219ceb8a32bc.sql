-- Fix: Remove email-based access pattern that could be exploited
-- Only allow booking access via strict user_id match for authenticated users

-- Drop the vulnerable policy
DROP POLICY IF EXISTS "bookings_users_view_own" ON public.bookings;

-- Create a stricter policy that only uses user_id matching
-- This prevents email-based exploitation while still allowing booking owners to view their bookings
CREATE POLICY "bookings_users_view_own"
ON public.bookings
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Note: Admin/staff access is already handled by bookings_admin_full_access policy
-- Note: Anonymous bookings (user_id = NULL) will only be accessible by admin/staff
-- This is the secure approach - users must be authenticated and linked to view their bookings