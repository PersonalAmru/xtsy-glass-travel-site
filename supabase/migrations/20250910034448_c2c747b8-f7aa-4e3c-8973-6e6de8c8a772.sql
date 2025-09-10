-- Security Hardening: Masked Views with Anonymization
BEGIN;

-- Helper function: anonymize IP addresses
CREATE OR REPLACE FUNCTION public.ip_anonymize(ip_text text)
RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE 
    WHEN ip_text IS NULL THEN NULL
    WHEN ip_text ~* '^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$' THEN
      -- IPv4: mask last octet
      regexp_replace(ip_text, '\.[0-9]+$', '.***')
    WHEN ip_text ~* '^[0-9a-f:]+$' THEN  
      -- IPv6: mask last 64 bits
      regexp_replace(ip_text, ':([0-9a-f]+:){0,3}[0-9a-f]+$', ':***:***:***:***')
    ELSE 'masked'
  END;
$$;

-- TRANSACTIONS admin view (limited columns, no sensitive gateway data)
DROP VIEW IF EXISTS public.transactions_admin_view;
CREATE VIEW public.transactions_admin_view AS
SELECT 
  id, 
  booking_id, 
  amount, 
  currency, 
  payment_status as status,
  source as gateway,
  created_at
FROM public.transactions;

ALTER VIEW public.transactions_admin_view SET (security_invoker = true, security_barrier = true);

-- SECURITY_ALERTS masked view (anonymize IP, truncate user agent)
DROP VIEW IF EXISTS public.security_alerts_masked;
CREATE VIEW public.security_alerts_masked AS
SELECT 
  id, 
  created_at, 
  alert_type as event_type,
  severity,
  ip_anonymize(ip_address) AS ip,
  LEFT(COALESCE(details->>'user_agent',''), 80) AS user_agent,
  details, 
  resolved, 
  resolved_by
FROM public.security_alerts;

ALTER VIEW public.security_alerts_masked SET (security_invoker = true, security_barrier = true);

-- SECRET_ACCESS_LOG masked view (if table exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'secret_access_log') THEN
    ALTER TABLE public.secret_access_log ENABLE ROW LEVEL SECURITY;
    
    -- Drop existing policies
    DROP POLICY IF EXISTS "secret_access_log_admin_only" ON public.secret_access_log;
    DROP POLICY IF EXISTS "secaccess_no_public" ON public.secret_access_log;
    DROP POLICY IF EXISTS "secaccess_service_full" ON public.secret_access_log;
    DROP POLICY IF EXISTS "secaccess_admin_update" ON public.secret_access_log;
    
    -- Create strict policies
    CREATE POLICY "secaccess_no_public"
    ON public.secret_access_log FOR ALL TO public USING (false);
    
    CREATE POLICY "secaccess_service_full"
    ON public.secret_access_log FOR ALL TO service_role USING (true) WITH CHECK (true);
    
    CREATE POLICY "secaccess_admin_full"
    ON public.secret_access_log FOR ALL TO authenticated 
    USING (is_admin()) WITH CHECK (is_admin());
    
    -- Create masked view
    DROP VIEW IF EXISTS public.secret_access_log_masked;
    CREATE VIEW public.secret_access_log_masked AS
    SELECT 
      id, 
      accessed_at as created_at,
      'secret_access' as event,
      ip_anonymize(ip_address) AS ip,
      LEFT(COALESCE(user_agent,''), 80) AS user_agent,
      LEFT(secret_name, 50) AS path_preview
    FROM public.secret_access_log;
    
    ALTER VIEW public.secret_access_log_masked SET (security_invoker = true, security_barrier = true);
  END IF;
END $$;

-- NEWSLETTER stats (aggregated, no PII)
DROP VIEW IF EXISTS public.newsletter_stats;
CREATE VIEW public.newsletter_stats AS
SELECT 
  COUNT(*) AS total_subscribers,
  COUNT(*) FILTER (WHERE is_active = true) AS active_subscribers,
  COUNT(*) FILTER (WHERE is_active = false) AS inactive_subscribers,
  COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') AS new_this_week,
  COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') AS new_this_month,
  COUNT(DISTINCT array_to_string(interests, ',')) AS unique_interest_combinations
FROM public.newsletter_subscribers;

ALTER VIEW public.newsletter_stats SET (security_invoker = true, security_barrier = true);

COMMIT;