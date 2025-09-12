-- Security Audit Remediation: Implement comprehensive RLS and data access controls

-- Step 1: Add user_id to bookings table if not exists and backfill from email matching
DO $$ 
BEGIN
  -- Add user_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'user_id' AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.bookings ADD COLUMN user_id UUID REFERENCES auth.users(id);
  END IF;
  
  -- Backfill user_id from email matching where possible
  UPDATE public.bookings b
  SET user_id = u.id 
  FROM auth.users u 
  WHERE b.user_id IS NULL AND u.email = b.email;
END $$;

-- Step 2: Create secure functions for booking access
CREATE OR REPLACE FUNCTION public.verify_booking_owner_only(booking_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

-- Step 3: Create secure functions to access user's own bookings
CREATE OR REPLACE FUNCTION public.get_user_bookings_secure()
RETURNS TABLE(
  id uuid, booking_id text, check_in date, check_out date, guests integer, 
  subtotal integer, taxes integer, total_amount integer, created_at timestamptz, 
  updated_at timestamptz, confirmed_at timestamptz, cancelled_at timestamptz,
  guest_name text, email text, whatsapp_number text, room_type text, 
  booking_status text, payment_status text, address text, city text, 
  state text, pincode text, emergency_contact text, special_requests text, source text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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
    b.id, b.booking_id, b.check_in, b.check_out, b.guests,
    b.subtotal, b.taxes, b.total_amount, b.created_at, b.updated_at,
    b.confirmed_at, b.cancelled_at, b.guest_name,
    -- Only show full data if user is admin/staff, otherwise mask
    CASE 
      WHEN is_admin_or_staff() THEN b.email
      ELSE jwt_email -- Show only their own email
    END as email,
    CASE 
      WHEN is_admin_or_staff() THEN b.whatsapp_number
      ELSE REGEXP_REPLACE(b.whatsapp_number, '(.{3}).*(.{2})$', '\1***\2', 'g')
    END as whatsapp_number,
    b.room_type, b.booking_status, b.payment_status,
    CASE 
      WHEN is_admin_or_staff() THEN b.address
      ELSE LEFT(COALESCE(b.address, ''), 30) || CASE WHEN LENGTH(COALESCE(b.address, '')) > 30 THEN '...' ELSE '' END
    END as address,
    b.city, b.state, b.pincode,
    CASE 
      WHEN is_admin_or_staff() THEN b.emergency_contact
      ELSE REGEXP_REPLACE(COALESCE(b.emergency_contact, ''), '(.{3}).*(.{2})$', '\1***\2', 'g')
    END as emergency_contact,
    b.special_requests, b.source
  FROM public.bookings b
  WHERE LOWER(TRIM(b.email)) = LOWER(TRIM(jwt_email))
    AND verify_booking_owner_only(b.email);
END;
$$;

-- Step 4: Create function to get single booking securely
CREATE OR REPLACE FUNCTION public.get_single_booking_secure(booking_id_param text)
RETURNS TABLE(
  id uuid, booking_id text, check_in date, check_out date, guests integer,
  subtotal integer, taxes integer, total_amount integer, created_at timestamptz,
  updated_at timestamptz, confirmed_at timestamptz, cancelled_at timestamptz,
  guest_name text, email text, whatsapp_number text, room_type text,
  booking_status text, payment_status text, address text, city text,
  state text, pincode text, emergency_contact text, special_requests text, source text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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
    b.id, b.booking_id, b.check_in, b.check_out, b.guests,
    b.subtotal, b.taxes, b.total_amount, b.created_at, b.updated_at,
    b.confirmed_at, b.cancelled_at, b.guest_name,
    CASE 
      WHEN is_admin_or_staff() THEN b.email
      ELSE jwt_email
    END as email,
    CASE 
      WHEN is_admin_or_staff() THEN b.whatsapp_number
      ELSE REGEXP_REPLACE(b.whatsapp_number, '(.{3}).*(.{2})$', '\1***\2', 'g')
    END as whatsapp_number,
    b.room_type, b.booking_status, b.payment_status,
    CASE 
      WHEN is_admin_or_staff() THEN b.address
      ELSE LEFT(COALESCE(b.address, ''), 30) || CASE WHEN LENGTH(COALESCE(b.address, '')) > 30 THEN '...' ELSE '' END
    END as address,
    b.city, b.state, b.pincode,
    CASE 
      WHEN is_admin_or_staff() THEN b.emergency_contact
      ELSE REGEXP_REPLACE(COALESCE(b.emergency_contact, ''), '(.{3}).*(.{2})$', '\1***\2', 'g')
    END as emergency_contact,
    b.special_requests, b.source
  FROM public.bookings b
  WHERE b.booking_id = booking_id_param
    AND LOWER(TRIM(b.email)) = LOWER(TRIM(jwt_email));
END;
$$;

-- Step 5: Create trigger to automatically set user_id on new bookings
CREATE OR REPLACE FUNCTION public.assign_booking_user_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  IF NEW.user_id IS NULL THEN 
    NEW.user_id := auth.uid(); 
  END IF;
  RETURN NEW;
END; 
$$;

-- Drop and recreate trigger to ensure it exists
DROP TRIGGER IF EXISTS assign_booking_user_id_trigger ON public.bookings;
CREATE TRIGGER assign_booking_user_id_trigger
  BEFORE INSERT ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.assign_booking_user_id();

-- Step 6: Update existing RLS policies for bookings
DROP POLICY IF EXISTS "bookings_public_insert" ON public.bookings;
DROP POLICY IF EXISTS "bookings_owner_select" ON public.bookings;
DROP POLICY IF EXISTS "bookings_admin_read" ON public.bookings;
DROP POLICY IF EXISTS "bookings_service_full" ON public.bookings;

-- Recreate bookings policies with enhanced security
CREATE POLICY "bookings_public_insert" 
  ON public.bookings FOR INSERT
  WITH CHECK (true);  -- anyone can insert

CREATE POLICY "bookings_owner_select" 
  ON public.bookings FOR SELECT TO authenticated
  USING (auth.uid() = user_id);  -- only owner can select their booking

CREATE POLICY "bookings_admin_read" 
  ON public.bookings FOR SELECT TO authenticated
  USING (is_admin_or_staff());   -- admin/staff can read all bookings

CREATE POLICY "bookings_service_full" 
  ON public.bookings FOR ALL TO service_role
  USING (true) WITH CHECK (true);  -- service role unrestricted

-- Step 7: Secure newsletter subscribers table
DROP POLICY IF EXISTS "newsletter_no_public" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "newsletter_public_insert" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "newsletter_admin_full" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "newsletter_service_full" ON public.newsletter_subscribers;

-- Newsletter policies - deny by default, allow only specific operations
CREATE POLICY "newsletter_no_public" 
  ON public.newsletter_subscribers FOR ALL TO public
  USING (false);  -- deny all by default

CREATE POLICY "newsletter_public_insert" 
  ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (true);  -- anyone (even anon) can insert

CREATE POLICY "newsletter_admin_full" 
  ON public.newsletter_subscribers FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());  -- only admin can read/update

CREATE POLICY "newsletter_service_full"
  ON public.newsletter_subscribers FOR ALL TO service_role
  USING (true) WITH CHECK (true);  -- service role full access

-- Step 8: Secure profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON public.profiles;

-- Profiles policies - self-access only
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);  -- user can select own profile

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);  -- user can update own profile

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (is_admin());  -- admin can read any profile

CREATE POLICY "Service role can manage all profiles"
  ON public.profiles FOR ALL TO service_role
  USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');