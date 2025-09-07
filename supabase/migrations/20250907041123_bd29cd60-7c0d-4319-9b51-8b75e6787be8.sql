-- Migration 2: Masked Views for Admin Access (Fixed)
BEGIN;

-- 1) Transactions admin view - limited columns with security barrier
CREATE OR REPLACE VIEW public.transactions_admin_view
WITH (security_invoker = true, security_barrier = true) AS
SELECT 
  id,
  booking_id,
  amount,
  currency,
  payment_status,
  created_at,
  txn_id,
  -- Mask sensitive gateway data
  CASE 
    WHEN is_admin() THEN razorpay_payment_id
    ELSE LEFT(COALESCE(razorpay_payment_id, ''), 8) || '...'
  END as razorpay_payment_id,
  source,
  matched,
  verified_at
FROM public.transactions;

-- 2) Security alerts masked view - anonymize IP and truncate user agent
CREATE OR REPLACE VIEW public.security_alerts_masked
WITH (security_invoker = true, security_barrier = true) AS
SELECT 
  id,
  alert_type,
  severity,
  details,
  resolved,
  resolved_at,
  resolved_by,
  created_at,
  user_id,
  -- Anonymize IP address (keep first 2 octets for IPv4, first 4 groups for IPv6)
  CASE 
    WHEN ip_address IS NULL THEN NULL
    WHEN ip_address LIKE '%.%.%.%' THEN -- IPv4
      SPLIT_PART(ip_address, '.', 1) || '.' || SPLIT_PART(ip_address, '.', 2) || '.XXX.XXX'
    WHEN ip_address LIKE '%:%' THEN -- IPv6  
      SPLIT_PART(ip_address, ':', 1) || ':' || SPLIT_PART(ip_address, ':', 2) || 
      ':' || SPLIT_PART(ip_address, ':', 3) || ':' || SPLIT_PART(ip_address, ':', 4) || '::XXXX'
    ELSE 'XXX.XXX.XXX.XXX'
  END as ip_address_masked
FROM public.security_alerts;

-- 3) Secret access log masked view - anonymize sensitive data
CREATE OR REPLACE VIEW public.secret_access_log_masked
WITH (security_invoker = true, security_barrier = true) AS
SELECT 
  id,
  user_id,
  user_email,
  secret_name,
  access_granted,
  accessed_at,
  -- Anonymize IP address
  CASE 
    WHEN ip_address IS NULL THEN NULL
    WHEN ip_address LIKE '%.%.%.%' THEN -- IPv4
      SPLIT_PART(ip_address, '.', 1) || '.' || SPLIT_PART(ip_address, '.', 2) || '.XXX.XXX'
    WHEN ip_address LIKE '%:%' THEN -- IPv6  
      SPLIT_PART(ip_address, ':', 1) || ':' || SPLIT_PART(ip_address, ':', 2) || 
      ':' || SPLIT_PART(ip_address, ':', 3) || ':' || SPLIT_PART(ip_address, ':', 4) || '::XXXX'
    ELSE 'XXX.XXX.XXX.XXX'
  END as ip_address_masked,
  -- Truncate user agent to prevent fingerprinting
  LEFT(COALESCE(user_agent, ''), 50) || CASE WHEN LENGTH(COALESCE(user_agent, '')) > 50 THEN '...' ELSE '' END as user_agent_truncated
FROM public.secret_access_log;

-- 4) Newsletter stats view - admin-only counts, no email exposure (fixed)
CREATE OR REPLACE VIEW public.newsletter_stats
WITH (security_invoker = true, security_barrier = true) AS
SELECT 
  COUNT(*) as total_subscribers,
  COUNT(*) FILTER (WHERE is_active = true) as active_subscribers,
  COUNT(*) FILTER (WHERE is_active = false) as inactive_subscribers,
  COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as new_this_month,
  COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as new_this_week,
  -- Count unique interest combinations without exposing individual data
  COUNT(DISTINCT interests) FILTER (WHERE interests IS NOT NULL AND array_length(interests, 1) > 0) as unique_interest_combinations
FROM public.newsletter_subscribers;

-- 5) Create secure admin functions for controlled PII access
CREATE OR REPLACE FUNCTION public.get_transaction_details_admin(p_transaction_id uuid)
RETURNS TABLE (
  id uuid,
  booking_id uuid,
  amount integer,
  currency text,
  payment_status text,
  razorpay_payment_id text,
  gateway_response jsonb,
  txn_id text,
  created_at timestamptz
) AS $$
BEGIN
  IF NOT is_admin_or_staff() THEN
    RAISE EXCEPTION 'Admin privileges required.';
  END IF;

  RETURN QUERY
  SELECT t.id, t.booking_id, t.amount, t.currency, t.payment_status, 
         t.razorpay_payment_id, t.gateway_response, t.txn_id, t.created_at
  FROM public.transactions t
  WHERE t.id = p_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;

-- 6) Create function to get newsletter subscriber details (admin only)
CREATE OR REPLACE FUNCTION public.get_newsletter_subscriber_details_admin(p_subscriber_id uuid)
RETURNS TABLE (
  id uuid,
  email text,
  full_name text,
  interests text[],
  subscribed_at timestamptz,
  is_active boolean
) AS $$
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Admin privileges required.';
  END IF;

  RETURN QUERY
  SELECT s.id, s.email, s.full_name, s.interests, s.subscribed_at, s.is_active
  FROM public.newsletter_subscribers s
  WHERE s.id = p_subscriber_id;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;

-- 7) Security alert resolution function (admin only)
CREATE OR REPLACE FUNCTION public.resolve_security_alert_admin(p_alert_id uuid, p_resolution_notes text DEFAULT NULL)
RETURNS boolean AS $$
DECLARE
  alert_exists boolean;
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Admin privileges required.';
  END IF;

  -- Check if alert exists and is not already resolved
  SELECT EXISTS(
    SELECT 1 FROM public.security_alerts 
    WHERE id = p_alert_id AND resolved = false
  ) INTO alert_exists;

  IF NOT alert_exists THEN
    RETURN false;
  END IF;

  -- Update the alert
  UPDATE public.security_alerts 
  SET 
    resolved = true,
    resolved_at = now(),
    resolved_by = auth.uid(),
    details = CASE 
      WHEN p_resolution_notes IS NOT NULL THEN 
        COALESCE(details, '{}'::jsonb) || jsonb_build_object('resolution_notes', p_resolution_notes)
      ELSE details
    END
  WHERE id = p_alert_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;

COMMIT;