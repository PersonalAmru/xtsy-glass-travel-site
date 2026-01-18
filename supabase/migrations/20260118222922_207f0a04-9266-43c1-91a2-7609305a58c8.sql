-- Drop the old restrictive policies first
DROP POLICY IF EXISTS "Admins can view all enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Users can view their own enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Allow users to view enquiries from current session" ON public.enquiries;

-- Create a more permissive SELECT policy
CREATE POLICY "Allow viewing enquiries"
ON public.enquiries
FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR (user_id IS NOT NULL AND user_id = auth.uid())
  OR (created_at > now() - interval '5 minutes')
);