-- Fix Destinations Table Security - Restrict Write Access to Admin/Service Only
BEGIN;

-- Drop the overly permissive policy that allows anyone to manage destinations
DROP POLICY IF EXISTS "Only service role can manage destinations" ON public.destinations;
DROP POLICY IF EXISTS "Destinations are viewable by everyone" ON public.destinations;

-- Create secure policies with proper access control

-- 1. Public read access - users need to see available destinations
CREATE POLICY "Public can view destinations"
ON public.destinations FOR SELECT
USING (true);

-- 2. Service role full access (for backend operations)
CREATE POLICY "Service role full destinations access"
ON public.destinations FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 3. Admin users can manage destinations
CREATE POLICY "Admins can insert destinations"
ON public.destinations FOR INSERT TO authenticated
WITH CHECK (is_admin_or_staff());

CREATE POLICY "Admins can update destinations"
ON public.destinations FOR UPDATE TO authenticated
USING (is_admin_or_staff())
WITH CHECK (is_admin_or_staff());

CREATE POLICY "Admins can delete destinations"
ON public.destinations FOR DELETE TO authenticated
USING (is_admin_or_staff());

-- 4. Block all other access explicitly
CREATE POLICY "Block unauthorized destination modifications"
ON public.destinations FOR ALL
USING (false);

COMMIT;