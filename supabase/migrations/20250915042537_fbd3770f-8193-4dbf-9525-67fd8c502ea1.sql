-- Secure Transactions Admin View: Fix Payment Data Exposure
-- The transactions_admin_view currently has no RLS protection

-- Enable RLS on the admin view
ALTER TABLE public.transactions_admin_view ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies on the view (if any)
DROP POLICY IF EXISTS "transactions_admin_view_admin_only" ON public.transactions_admin_view;
DROP POLICY IF EXISTS "transactions_admin_view_service_only" ON public.transactions_admin_view;

-- TRANSACTIONS ADMIN VIEW: Only admin users can access
CREATE POLICY "transactions_admin_view_admin_select_only" ON public.transactions_admin_view
FOR SELECT 
TO authenticated
USING (is_admin());

-- TRANSACTIONS ADMIN VIEW: Service role full access for backend operations
CREATE POLICY "transactions_admin_view_service_role_only" ON public.transactions_admin_view
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

-- TRANSACTIONS ADMIN VIEW: Deny all public and anonymous access
CREATE POLICY "transactions_admin_view_deny_public_select" ON public.transactions_admin_view
FOR SELECT 
TO anon
USING (false);

CREATE POLICY "transactions_admin_view_deny_public_insert" ON public.transactions_admin_view
FOR INSERT 
TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "transactions_admin_view_deny_public_update" ON public.transactions_admin_view
FOR UPDATE 
TO anon, authenticated
USING (false);

CREATE POLICY "transactions_admin_view_deny_public_delete" ON public.transactions_admin_view
FOR DELETE 
TO anon, authenticated
USING (false);

-- Additional security: Revoke any existing public grants on the view
REVOKE ALL ON public.transactions_admin_view FROM PUBLIC, anon;

-- Ensure only service_role and authenticated users with proper roles can access
GRANT SELECT ON public.transactions_admin_view TO service_role;

-- Log this security fix in security alerts
INSERT INTO public.security_alerts (
  alert_type,
  severity,
  details,
  resolved,
  resolved_at
) VALUES (
  'transactions_admin_view_secured',
  'high',
  jsonb_build_object(
    'issue', 'transactions_admin_view had no RLS protection',
    'fix', 'Added RLS policies to restrict access to admin users only',
    'timestamp', now(),
    'security_impact', 'Prevented potential exposure of payment transaction data'
  ),
  true,
  now()
);