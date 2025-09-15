-- Security Fix: Restrict metrics table access to prevent business data exposure

-- Drop the public read policy that exposes business metrics
DROP POLICY IF EXISTS "metrics_public_read_only" ON public.metrics;

-- Add restricted read policy for authenticated admin/staff only
CREATE POLICY "metrics_admin_staff_read_only" ON public.metrics
  FOR SELECT 
  TO authenticated
  USING (is_admin_or_staff());

-- Note: Public increment functionality is preserved via the secure increment_metric() function
-- which uses SECURITY DEFINER to bypass RLS policies when incrementing counters