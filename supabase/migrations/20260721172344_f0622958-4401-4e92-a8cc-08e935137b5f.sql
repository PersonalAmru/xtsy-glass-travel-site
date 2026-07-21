
-- Fix 1: booking_audit_log — remove spoofable email-based self-read policies.
-- Audit logs should be admin/staff-only; users should not read audit rows via JWT email match.
DROP POLICY IF EXISTS "Users can view their own audit logs" ON public.booking_audit_log;
DROP POLICY IF EXISTS "Users view own audit logs" ON public.booking_audit_log;

-- Fix 2: restaurant_reviews — add rate limiting trigger to prevent spam insertion.
CREATE OR REPLACE FUNCTION public.enforce_restaurant_review_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_count INTEGER;
BEGIN
  -- Cap pending reviews per guest_name to 3 within a rolling 24h window.
  SELECT COUNT(*) INTO recent_count
  FROM public.restaurant_reviews
  WHERE lower(guest_name) = lower(NEW.guest_name)
    AND created_at > now() - interval '24 hours';

  IF recent_count >= 3 THEN
    RAISE EXCEPTION 'Review submission rate limit exceeded. Please try again later.'
      USING ERRCODE = 'check_violation';
  END IF;

  -- Global safety cap: no more than 50 unapproved reviews created in the last hour.
  SELECT COUNT(*) INTO recent_count
  FROM public.restaurant_reviews
  WHERE approved = false
    AND created_at > now() - interval '1 hour';

  IF recent_count >= 50 THEN
    RAISE EXCEPTION 'Too many pending reviews. Please try again later.'
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_restaurant_reviews_rate_limit ON public.restaurant_reviews;
CREATE TRIGGER trg_restaurant_reviews_rate_limit
BEFORE INSERT ON public.restaurant_reviews
FOR EACH ROW EXECUTE FUNCTION public.enforce_restaurant_review_rate_limit();
