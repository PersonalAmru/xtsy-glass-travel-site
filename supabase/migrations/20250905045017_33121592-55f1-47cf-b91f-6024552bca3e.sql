-- Critical security fix: Restrict booking access to actual booking owners only
-- This prevents authenticated users from accessing other users' booking data

-- Drop the current policy that's still too permissive
DROP POLICY IF EXISTS "Authenticated users must verify booking ownership" ON public.bookings;

-- Create a highly secure function that only allows access to the actual booking owner
CREATE OR REPLACE FUNCTION public.verify_booking_owner_only(booking_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  jwt_email text;
  user_id_from_jwt uuid;
  rate_limit_count integer;
BEGIN
  -- Get user information from JWT
  jwt_email := get_jwt_email();
  user_id_from_jwt := auth.uid();
  
  -- CRITICAL: User must be authenticated
  IF user_id_from_jwt IS NULL OR jwt_email IS NULL THEN
    -- Log unauthorized access attempt
    INSERT INTO public.security_alerts (alert_type, severity, details)
    VALUES ('unauthorized_booking_access_attempt', 'high', jsonb_build_object(
      'attempted_email', booking_email,
      'timestamp', now(),
      'ip_address', 'unknown'
    ));
    RETURN false;
  END IF;
  
  -- CRITICAL: JWT email must EXACTLY match the booking email
  -- This ensures only the actual booking owner can access their data
  IF LOWER(TRIM(jwt_email)) != LOWER(TRIM(booking_email)) THEN
    -- Log potential account takeover attempt
    INSERT INTO public.security_alerts (alert_type, severity, details, user_id)
    VALUES ('booking_access_email_mismatch', 'high', jsonb_build_object(
      'jwt_email', jwt_email,
      'requested_booking_email', booking_email,
      'user_id', user_id_from_jwt
    ), user_id_from_jwt);
    RETURN false;
  END IF;
  
  -- Rate limiting: Check for excessive booking queries from this user
  SELECT COUNT(*) INTO rate_limit_count
  FROM public.security_alerts
  WHERE user_id = user_id_from_jwt
    AND alert_type IN ('booking_access_request', 'excessive_booking_queries')
    AND created_at > now() - INTERVAL '5 minutes';
  
  -- Allow max 20 booking access attempts per 5 minutes
  IF rate_limit_count > 20 THEN
    INSERT INTO public.security_alerts (alert_type, severity, details, user_id)
    VALUES ('excessive_booking_queries', 'critical', jsonb_build_object(
      'email', jwt_email,
      'query_count_5min', rate_limit_count,
      'blocked_at', now()
    ), user_id_from_jwt);
    RETURN false;
  END IF;
  
  -- Log legitimate access for audit trail
  INSERT INTO public.security_alerts (alert_type, severity, details, user_id)
  VALUES ('booking_access_request', 'low', jsonb_build_object(
    'email', jwt_email,
    'access_granted', true,
    'timestamp', now()
  ), user_id_from_jwt);
  
  RETURN true;
END;
$$;

-- Create the most restrictive RLS policy possible
CREATE POLICY "Only booking owners can access their own bookings" ON public.bookings
FOR SELECT TO authenticated
USING (verify_booking_owner_only(email));

-- Create a secure booking retrieval function with additional safeguards
CREATE OR REPLACE FUNCTION public.get_user_bookings_secure()
RETURNS TABLE (
  id uuid,
  booking_id text,
  check_in date,
  check_out date,
  guests integer,
  subtotal integer,
  taxes integer,
  total_amount integer,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  confirmed_at timestamp with time zone,
  cancelled_at timestamp with time zone,
  guest_name text,
  email text,
  whatsapp_number text,
  room_type text,
  booking_status text,
  payment_status text,
  address text,
  city text,
  state text,
  pincode text,
  emergency_contact text,
  special_requests text,
  source text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  jwt_email text;
  user_id_from_jwt uuid;
BEGIN
  -- Get authenticated user information
  jwt_email := get_jwt_email();
  user_id_from_jwt := auth.uid();
  
  -- Verify user is properly authenticated
  IF user_id_from_jwt IS NULL OR jwt_email IS NULL THEN
    RETURN;
  END IF;
  
  -- Return only bookings that belong to the authenticated user
  -- with data masking for sensitive fields
  RETURN QUERY
  SELECT 
    b.id,
    b.booking_id,
    b.check_in,
    b.check_out,
    b.guests,
    b.subtotal,
    b.taxes,
    b.total_amount,
    b.created_at,
    b.updated_at,
    b.confirmed_at,
    b.cancelled_at,
    b.guest_name,
    -- Only show full data if user is admin/staff, otherwise mask
    CASE 
      WHEN is_admin_or_staff() THEN b.email
      ELSE jwt_email -- Show only their own email
    END as email,
    CASE 
      WHEN is_admin_or_staff() THEN b.whatsapp_number
      ELSE REGEXP_REPLACE(b.whatsapp_number, '(.{3}).*(.{2})$', '\1***\2', 'g')
    END as whatsapp_number,
    b.room_type,
    b.booking_status,
    b.payment_status,
    CASE 
      WHEN is_admin_or_staff() THEN b.address
      ELSE LEFT(COALESCE(b.address, ''), 30) || CASE WHEN LENGTH(COALESCE(b.address, '')) > 30 THEN '...' ELSE '' END
    END as address,
    b.city,
    b.state,
    b.pincode,
    CASE 
      WHEN is_admin_or_staff() THEN b.emergency_contact
      ELSE REGEXP_REPLACE(COALESCE(b.emergency_contact, ''), '(.{3}).*(.{2})$', '\1***\2', 'g')
    END as emergency_contact,
    b.special_requests,
    b.source
  FROM public.bookings b
  WHERE LOWER(TRIM(b.email)) = LOWER(TRIM(jwt_email))
    AND verify_booking_owner_only(b.email);
END;
$$;

-- Create function to get a single booking with strict security
CREATE OR REPLACE FUNCTION public.get_single_booking_secure(booking_id_param text)
RETURNS TABLE (
  id uuid,
  booking_id text,
  check_in date,
  check_out date,
  guests integer,
  subtotal integer,
  taxes integer,
  total_amount integer,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  confirmed_at timestamp with time zone,
  cancelled_at timestamp with time zone,
  guest_name text,
  email text,
  whatsapp_number text,
  room_type text,
  booking_status text,
  payment_status text,
  address text,
  city text,
  state text,
  pincode text,
  emergency_contact text,
  special_requests text,
  source text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  jwt_email text;
  user_id_from_jwt uuid;
  booking_owner_email text;
BEGIN
  -- Get authenticated user information
  jwt_email := get_jwt_email();
  user_id_from_jwt := auth.uid();
  
  -- Verify user is properly authenticated
  IF user_id_from_jwt IS NULL OR jwt_email IS NULL THEN
    RETURN;
  END IF;
  
  -- First, check if the booking exists and get its owner email
  SELECT email INTO booking_owner_email
  FROM public.bookings
  WHERE booking_id = booking_id_param
  LIMIT 1;
  
  -- If booking doesn't exist, return nothing
  IF booking_owner_email IS NULL THEN
    RETURN;
  END IF;
  
  -- Verify the authenticated user is the actual booking owner
  IF LOWER(TRIM(jwt_email)) != LOWER(TRIM(booking_owner_email)) THEN
    -- Log unauthorized access attempt
    INSERT INTO public.security_alerts (alert_type, severity, details, user_id)
    VALUES ('unauthorized_single_booking_access', 'high', jsonb_build_object(
      'jwt_email', jwt_email,
      'booking_id', booking_id_param,
      'booking_owner_email', booking_owner_email
    ), user_id_from_jwt);
    RETURN;
  END IF;
  
  -- Return the booking data with appropriate masking
  RETURN QUERY
  SELECT 
    b.id,
    b.booking_id,
    b.check_in,
    b.check_out,
    b.guests,
    b.subtotal,
    b.taxes,
    b.total_amount,
    b.created_at,
    b.updated_at,
    b.confirmed_at,
    b.cancelled_at,
    b.guest_name,
    CASE 
      WHEN is_admin_or_staff() THEN b.email
      ELSE jwt_email
    END as email,
    CASE 
      WHEN is_admin_or_staff() THEN b.whatsapp_number
      ELSE REGEXP_REPLACE(b.whatsapp_number, '(.{3}).*(.{2})$', '\1***\2', 'g')
    END as whatsapp_number,
    b.room_type,
    b.booking_status,
    b.payment_status,
    CASE 
      WHEN is_admin_or_staff() THEN b.address
      ELSE LEFT(COALESCE(b.address, ''), 30) || CASE WHEN LENGTH(COALESCE(b.address, '')) > 30 THEN '...' ELSE '' END
    END as address,
    b.city,
    b.state,
    b.pincode,
    CASE 
      WHEN is_admin_or_staff() THEN b.emergency_contact
      ELSE REGEXP_REPLACE(COALESCE(b.emergency_contact, ''), '(.{3}).*(.{2})$', '\1***\2', 'g')
    END as emergency_contact,
    b.special_requests,
    b.source
  FROM public.bookings b
  WHERE b.booking_id = booking_id_param
    AND LOWER(TRIM(b.email)) = LOWER(TRIM(jwt_email));
END;
$$;

-- Add comprehensive security comments
COMMENT ON FUNCTION public.verify_booking_owner_only IS 
'Ultra-secure function that only allows booking access to the actual owner whose JWT email exactly matches the booking email. Includes rate limiting and comprehensive audit logging.';

COMMENT ON FUNCTION public.get_user_bookings_secure IS 
'Secure function to retrieve all bookings for the authenticated user only, with automatic data masking and strict ownership verification.';

COMMENT ON FUNCTION public.get_single_booking_secure IS 
'Secure function to retrieve a single booking with strict ownership verification and comprehensive security logging.';

-- Create additional index for performance
CREATE INDEX IF NOT EXISTS idx_bookings_email_lower 
ON public.bookings(LOWER(TRIM(email)));

-- Clean up old insecure functions
DROP FUNCTION IF EXISTS public.verify_booking_access_secure(text, text);
DROP FUNCTION IF EXISTS public.get_secure_booking_data(text, text);