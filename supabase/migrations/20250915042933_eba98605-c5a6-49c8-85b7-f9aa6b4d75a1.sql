-- Secure Transactions Admin View: Fix Function Signature Conflict
-- Drop existing function and recreate with proper security

-- Drop the existing view (if it exists)
DROP VIEW IF EXISTS public.transactions_admin_view;

-- Drop any existing function with the same name but different signature
DROP FUNCTION IF EXISTS public.get_transactions_admin_view_secure();

-- Create the secure function with proper access control
CREATE OR REPLACE FUNCTION public.get_transactions_admin_view_secure()
RETURNS TABLE(
  id uuid,
  booking_id uuid,
  amount integer,
  created_at timestamp with time zone,
  currency text,
  status text,
  gateway text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Only allow admin users and service_role to access transaction data
  IF NOT (is_admin() OR auth.role() = 'service_role') THEN
    RETURN;  -- Return empty result set for unauthorized users
  END IF;

  -- Return the same data that the original view provided, but with proper security
  RETURN QUERY
  SELECT 
    t.id,
    t.booking_id,
    t.amount,
    t.created_at,
    t.currency,
    t.payment_status as status,
    CASE 
      WHEN t.razorpay_payment_id IS NOT NULL THEN 'razorpay'
      ELSE 'unknown'
    END as gateway
  FROM public.transactions t
  ORDER BY t.created_at DESC;
END;
$function$;

-- Set proper permissions: only authenticated users can execute, function enforces admin check
GRANT EXECUTE ON FUNCTION public.get_transactions_admin_view_secure() TO authenticated, service_role;
REVOKE EXECUTE ON FUNCTION public.get_transactions_admin_view_secure() FROM anon, PUBLIC;

-- Add documentation
COMMENT ON FUNCTION public.get_transactions_admin_view_secure() IS 'Secure replacement for transactions_admin_view. Returns transaction data only for admin users and service_role. Unauthorized users get empty results.';

-- Also create a simpler function name for easier access
CREATE OR REPLACE FUNCTION public.transactions_admin_secure()
RETURNS TABLE(
  id uuid,
  booking_id uuid,
  amount integer,
  created_at timestamp with time zone,
  currency text,
  status text,
  gateway text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT * FROM public.get_transactions_admin_view_secure();
$function$;

-- Set the same permissions for the alias function
GRANT EXECUTE ON FUNCTION public.transactions_admin_secure() TO authenticated, service_role;
REVOKE EXECUTE ON FUNCTION public.transactions_admin_secure() FROM anon, PUBLIC;

-- Log this security fix in the security alerts
INSERT INTO public.security_alerts (
  alert_type,
  severity,
  details,
  resolved,
  resolved_at
) VALUES (
  'payment_data_exposure_fixed',
  'high',
  jsonb_build_object(
    'vulnerability', 'transactions_admin_view had no access controls',
    'impact', 'Payment transaction data could be exposed to unauthorized users',
    'fix_applied', 'Replaced view with secure function requiring admin privileges',
    'functions_created', ARRAY['get_transactions_admin_view_secure()', 'transactions_admin_secure()'],
    'access_control', 'Admin users and service_role only',
    'data_protected', ARRAY['transaction_amounts', 'booking_ids', 'payment_status', 'gateway_info'],
    'security_level', 'critical_data_now_secured',
    'timestamp', now()
  ),
  true,
  now()
);