-- Revoke Public Access and Secure Views (Fixed Syntax)
BEGIN;

-- Revoke PUBLIC and anon access from all sensitive views
REVOKE ALL ON public.bookings_masked FROM PUBLIC, anon;
REVOKE ALL ON public.security_alerts_masked FROM PUBLIC, anon;
REVOKE ALL ON public.transactions_admin_view FROM PUBLIC, anon;
REVOKE ALL ON public.newsletter_stats FROM PUBLIC, anon;

-- Grant minimal access with RLS enforcement
GRANT SELECT ON public.bookings_masked TO authenticated;
GRANT SELECT ON public.security_alerts_masked TO authenticated;
GRANT SELECT ON public.transactions_admin_view TO authenticated;
GRANT SELECT ON public.newsletter_stats TO authenticated;

-- Revoke from secret_access_log_masked if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema = 'public' AND table_name = 'secret_access_log_masked') THEN
    REVOKE ALL ON public.secret_access_log_masked FROM PUBLIC, anon;
    GRANT SELECT ON public.secret_access_log_masked TO authenticated;
  END IF;
END $$;

-- Enable RLS on views and create policies
ALTER VIEW public.bookings_masked SET (security_invoker = true, security_barrier = true);
DROP POLICY IF EXISTS "bookings_masked_owner_access" ON public.bookings_masked;
DROP POLICY IF EXISTS "bookings_masked_admin_access" ON public.bookings_masked;
CREATE POLICY "bookings_masked_owner_access"
ON public.bookings_masked FOR SELECT TO authenticated
USING (auth.uid() = user_id);
CREATE POLICY "bookings_masked_admin_access"
ON public.bookings_masked FOR SELECT TO authenticated
USING (is_admin_or_staff());

ALTER VIEW public.security_alerts_masked SET (security_invoker = true, security_barrier = true);
DROP POLICY IF EXISTS "secalerts_masked_admin_only" ON public.security_alerts_masked;
CREATE POLICY "secalerts_masked_admin_only"
ON public.security_alerts_masked FOR SELECT TO authenticated
USING (is_admin());

ALTER VIEW public.transactions_admin_view SET (security_invoker = true, security_barrier = true);
DROP POLICY IF EXISTS "tx_admin_view_admin_only" ON public.transactions_admin_view;
CREATE POLICY "tx_admin_view_admin_only"
ON public.transactions_admin_view FOR SELECT TO authenticated
USING (is_admin_or_staff());

ALTER VIEW public.newsletter_stats SET (security_invoker = true, security_barrier = true);
DROP POLICY IF EXISTS "newsletter_stats_admin_only" ON public.newsletter_stats;
CREATE POLICY "newsletter_stats_admin_only"
ON public.newsletter_stats FOR SELECT TO authenticated
USING (is_admin());

-- Add policy for secret access log masked view if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema = 'public' AND table_name = 'secret_access_log_masked') THEN
    ALTER VIEW public.secret_access_log_masked SET (security_invoker = true, security_barrier = true);
    DROP POLICY IF EXISTS "secaccess_masked_admin_only" ON public.secret_access_log_masked;
    CREATE POLICY "secaccess_masked_admin_only"
    ON public.secret_access_log_masked FOR SELECT TO authenticated
    USING (is_admin());
  END IF;
END $$;

-- Block future PUBLIC grants on new views in this schema
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM PUBLIC, anon;

COMMIT;