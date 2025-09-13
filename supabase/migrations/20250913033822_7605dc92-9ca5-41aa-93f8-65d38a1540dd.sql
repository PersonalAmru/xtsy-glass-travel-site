-- Enable RLS on sensitive view tables that currently lack protection
ALTER TABLE public.bookings_masked ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.secret_access_log_masked ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_alerts_masked ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions_admin_view ENABLE ROW LEVEL SECURITY;

-- Create restrictive policies for masked booking data
-- Only admin/staff can access masked booking views
CREATE POLICY "masked_bookings_admin_only" ON public.bookings_masked
FOR ALL TO authenticated
USING (is_admin_or_staff());

-- Newsletter stats should only be accessible to admins
CREATE POLICY "newsletter_stats_admin_only" ON public.newsletter_stats
FOR ALL TO authenticated
USING (is_admin());

-- Secret access logs are highly sensitive - admin only
CREATE POLICY "secret_logs_admin_only" ON public.secret_access_log_masked
FOR ALL TO authenticated
USING (is_admin());

-- Security alerts are admin-only operational data
CREATE POLICY "security_alerts_admin_only" ON public.security_alerts_masked
FOR ALL TO authenticated
USING (is_admin());

-- Transaction admin view is for admin/staff financial oversight
CREATE POLICY "transactions_admin_view_admin_only" ON public.transactions_admin_view
FOR ALL TO authenticated
USING (is_admin_or_staff());

-- Service role needs full access for system operations
CREATE POLICY "service_role_full_access_bookings_masked" ON public.bookings_masked
FOR ALL TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "service_role_full_access_newsletter_stats" ON public.newsletter_stats
FOR ALL TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "service_role_full_access_secret_logs" ON public.secret_access_log_masked
FOR ALL TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "service_role_full_access_security_alerts" ON public.security_alerts_masked
FOR ALL TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "service_role_full_access_transactions_view" ON public.transactions_admin_view
FOR ALL TO service_role
USING (true)
WITH CHECK (true);