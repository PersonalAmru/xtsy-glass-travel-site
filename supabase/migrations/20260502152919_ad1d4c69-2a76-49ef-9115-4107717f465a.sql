-- 1. Restrict public SELECT on properties to non-sensitive columns by removing the broad public policy
-- and creating a SECURITY INVOKER view that exposes only safe columns. Admin/staff retain full table access.
DROP POLICY IF EXISTS "Public can read properties" ON public.properties;
DROP POLICY IF EXISTS "properties_public_read" ON public.properties;

-- Authenticated admin/staff already have full ALL access via "Admin staff manage properties".
-- Provide a minimal authenticated-read policy for the table itself, restricted to admin/staff,
-- so anonymous and ordinary users cannot read sensitive contact fields.
-- Public consumers should query the `public_properties` view below instead.

CREATE OR REPLACE VIEW public.public_properties
WITH (security_invoker = true)
AS
SELECT
  id,
  name,
  slug,
  city,
  state,
  currency,
  logo_url,
  is_active,
  created_at,
  updated_at
FROM public.properties
WHERE is_active = true;

GRANT SELECT ON public.public_properties TO anon, authenticated;

-- Allow admin/staff to read full properties table via existing policy (already FOR ALL).
-- No additional public SELECT policy is created on the base table.

-- 2. Add admin SELECT policies for traffic_defense_logs and traffic_visitor_history
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='traffic_defense_logs') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admins can read traffic defense logs" ON public.traffic_defense_logs';
    EXECUTE 'CREATE POLICY "Admins can read traffic defense logs" ON public.traffic_defense_logs FOR SELECT TO authenticated USING (public.is_admin_or_staff())';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='traffic_visitor_history') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admins can read traffic visitor history" ON public.traffic_visitor_history';
    EXECUTE 'CREATE POLICY "Admins can read traffic visitor history" ON public.traffic_visitor_history FOR SELECT TO authenticated USING (public.is_admin_or_staff())';
  END IF;
END $$;