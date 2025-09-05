-- Enhanced security fix for bookings table
-- Replace vulnerable email-based JWT policy with stronger verification

-- First, drop the vulnerable policy
DROP POLICY IF EXISTS "Guests can only view their own bookings" ON public.bookings;

-- Create a more secure function for booking verification
CREATE OR REPLACE FUNCTION public.verify_booking_access(booking_email text, booking_id_param text DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  jwt_email text;
  user_authenticated boolean;
  booking_exists boolean;
  rate_limit_check integer;
BEGIN
  -- Get email from JWT
  jwt_email := get_jwt_email();
  
  -- Check if user is authenticated
  user_authenticated := auth.uid() IS NOT NULL;
  
  -- For unauthenticated users, deny access
  IF NOT user_authenticated THEN
    RETURN false;
  END IF;
  
  -- Verify email matches JWT
  IF jwt_email != booking_email THEN
    RETURN false;
  END IF;
  
  -- If booking_id is provided, verify it exists for this email
  IF booking_id_param IS NOT NULL THEN
    SELECT EXISTS(
      SELECT 1 FROM public.bookings 
      WHERE email = booking_email AND booking_id = booking_id_param
    ) INTO booking_exists;
    
    IF NOT booking_exists THEN
      RETURN false;
    END IF;
  END IF;
  
  -- Rate limiting check: prevent excessive queries
  SELECT COUNT(*) INTO rate_limit_check
  FROM public.booking_audit_log
  WHERE user_email = jwt_email 
    AND action_type = 'view'
    AND created_at > now() - INTERVAL '1 minute';
  
  -- Allow max 10 queries per minute per user
  IF rate_limit_check > 10 THEN
    -- Log suspicious activity
    INSERT INTO public.security_alerts (alert_type, severity, details, user_id)
    VALUES ('excessive_booking_queries', 'medium', jsonb_build_object(
      'email', jwt_email,
      'query_count', rate_limit_check
    ), auth.uid());
    
    RETURN false;
  END IF;
  
  -- Log the access for audit purposes
  INSERT INTO public.booking_audit_log (
    booking_id, action_type, user_email, accessed_fields
  ) VALUES (
    (SELECT id FROM public.bookings WHERE email = booking_email AND (booking_id_param IS NULL OR booking_id = booking_id_param) LIMIT 1),
    'view', jwt_email, ARRAY['email', 'booking_details']
  );
  
  RETURN true;
END;
$$;

-- Create enhanced RLS policy with stronger verification
CREATE POLICY "Authenticated users can view their verified bookings" ON public.bookings
FOR SELECT TO authenticated
USING (verify_booking_access(email, booking_id));

-- Create a view for sensitive data masking
CREATE OR REPLACE VIEW public.bookings_masked AS
SELECT 
  id,
  booking_id,
  check_in,
  check_out,
  guests,
  subtotal,
  taxes,
  total_amount,
  created_at,
  updated_at,
  confirmed_at,
  cancelled_at,
  guest_name,
  -- Mask sensitive fields for non-admin users
  CASE 
    WHEN is_admin_or_staff() THEN email
    ELSE REGEXP_REPLACE(email, '(.{2}).*@', '\1***@', 'g')
  END as email,
  CASE 
    WHEN is_admin_or_staff() THEN whatsapp_number
    ELSE REGEXP_REPLACE(whatsapp_number, '(.{2}).*(.{2})$', '\1***\2', 'g')
  END as whatsapp_number,
  room_type,
  booking_status,
  payment_status,
  CASE 
    WHEN is_admin_or_staff() THEN address
    ELSE LEFT(COALESCE(address, ''), 20) || '...'
  END as address,
  city,
  state,
  pincode,
  CASE 
    WHEN is_admin_or_staff() THEN emergency_contact
    ELSE REGEXP_REPLACE(COALESCE(emergency_contact, ''), '(.{2}).*(.{2})$', '\1***\2', 'g')
  END as emergency_contact,
  special_requests,
  source
FROM public.bookings;

-- Enable RLS on the masked view
ALTER VIEW public.bookings_masked SET (security_barrier = true);

-- Create RLS policy for the masked view
CREATE POLICY "Masked bookings access" ON public.bookings_masked
FOR SELECT TO authenticated
USING (verify_booking_access(
  CASE 
    WHEN is_admin_or_staff() THEN email
    ELSE (SELECT email FROM public.bookings WHERE id = bookings_masked.id LIMIT 1)
  END, 
  booking_id
));

-- Create additional security function to check for suspicious booking patterns
CREATE OR REPLACE FUNCTION public.detect_suspicious_booking_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_access_count integer;
  jwt_email text;
BEGIN
  jwt_email := get_jwt_email();
  
  -- Check for unusual access patterns
  SELECT COUNT(*) INTO recent_access_count
  FROM public.booking_audit_log
  WHERE user_email = jwt_email
    AND action_type = 'view'
    AND created_at > now() - INTERVAL '5 minutes';
  
  -- If more than 20 booking views in 5 minutes, flag as suspicious
  IF recent_access_count > 20 THEN
    INSERT INTO public.security_alerts (
      alert_type, severity, details, user_id
    ) VALUES (
      'suspicious_booking_access_pattern', 'high',
      jsonb_build_object(
        'email', jwt_email,
        'access_count_5min', recent_access_count,
        'booking_accessed', NEW.booking_id
      ),
      auth.uid()
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for suspicious access detection
CREATE TRIGGER detect_suspicious_booking_access_trigger
  AFTER INSERT ON public.booking_audit_log
  FOR EACH ROW
  EXECUTE FUNCTION detect_suspicious_booking_access();

-- Add additional security constraints
-- Ensure booking_audit_log has proper RLS
ALTER TABLE public.booking_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Booking audit log admin access" ON public.booking_audit_log
FOR ALL TO authenticated
USING (is_admin_or_staff())
WITH CHECK (is_admin_or_staff());

-- Create indexes for better performance on security queries
CREATE INDEX IF NOT EXISTS idx_booking_audit_log_user_email_created 
ON public.booking_audit_log(user_email, created_at);

CREATE INDEX IF NOT EXISTS idx_bookings_email_booking_id 
ON public.bookings(email, booking_id);

-- Add comment explaining the security enhancement
COMMENT ON FUNCTION public.verify_booking_access IS 
'Enhanced security function that verifies booking access with rate limiting, audit logging, and multiple verification checks to prevent token-based attacks';