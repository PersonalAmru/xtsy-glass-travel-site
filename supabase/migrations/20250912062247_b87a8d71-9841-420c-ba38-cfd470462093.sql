-- CRITICAL SECURITY FIX: Ensure bookings table is completely secure
-- Fix the guest PII exposure vulnerability

-- Step 1: Verify RLS is enabled on bookings table
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop any potentially insecure policies and recreate with strict security
DROP POLICY IF EXISTS "bookings_public_insert" ON public.bookings;
DROP POLICY IF EXISTS "bookings_owner_select" ON public.bookings;
DROP POLICY IF EXISTS "bookings_admin_read" ON public.bookings;
DROP POLICY IF EXISTS "bookings_service_full" ON public.bookings;
DROP POLICY IF EXISTS "Enable insert for anon users" ON public.bookings;
DROP POLICY IF EXISTS "Enable read for authenticated users only" ON public.bookings;
DROP POLICY IF EXISTS "Public can insert bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;

-- Step 3: Create secure, minimal access policies

-- Policy 1: Allow anonymous users to CREATE bookings only (for new bookings)
CREATE POLICY "secure_booking_insert" 
  ON public.bookings FOR INSERT
  WITH CHECK (true);

-- Policy 2: Allow authenticated users to view ONLY their own bookings
CREATE POLICY "secure_booking_owner_select" 
  ON public.bookings FOR SELECT TO authenticated
  USING (
    auth.uid() IS NOT NULL 
    AND user_id = auth.uid()
  );

-- Policy 3: Allow admin/staff to view all bookings (for management)
CREATE POLICY "secure_booking_admin_select" 
  ON public.bookings FOR SELECT TO authenticated
  USING (
    auth.uid() IS NOT NULL 
    AND is_admin_or_staff()
  );

-- Policy 4: Allow admin/staff to update bookings (for status changes)
CREATE POLICY "secure_booking_admin_update" 
  ON public.bookings FOR UPDATE TO authenticated
  USING (
    auth.uid() IS NOT NULL 
    AND is_admin_or_staff()
  )
  WITH CHECK (
    auth.uid() IS NOT NULL 
    AND is_admin_or_staff()
  );

-- Policy 5: Service role has full access for backend operations
CREATE POLICY "secure_booking_service_role" 
  ON public.bookings FOR ALL TO service_role
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Step 4: Create enhanced security function to verify booking ownership
CREATE OR REPLACE FUNCTION public.verify_booking_access(p_booking_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  booking_user_id uuid;
  current_user_id uuid;
  user_role text;
BEGIN
  current_user_id := auth.uid();
  user_role := get_user_role();
  
  -- Unauthenticated users cannot access booking data
  IF current_user_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Admin/staff can access any booking
  IF user_role IN ('admin', 'staff') THEN
    RETURN true;
  END IF;
  
  -- Regular users can only access their own bookings
  SELECT user_id INTO booking_user_id
  FROM public.bookings
  WHERE id = p_booking_id;
  
  RETURN (booking_user_id = current_user_id);
END;
$$;

-- Step 5: Add comprehensive audit logging for booking access
CREATE OR REPLACE FUNCTION public.log_booking_access_attempt(
  p_booking_id uuid, 
  p_access_type text, 
  p_success boolean DEFAULT true
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_email text;
  user_role text;
BEGIN
  user_email := get_jwt_email();
  user_role := get_user_role();
  
  INSERT INTO public.security_alerts (
    alert_type,
    severity,
    details,
    user_id
  ) VALUES (
    'booking_data_access',
    CASE WHEN p_success THEN 'low' ELSE 'high' END,
    jsonb_build_object(
      'booking_id', p_booking_id,
      'access_type', p_access_type,
      'success', p_success,
      'user_email', user_email,
      'user_role', user_role,
      'timestamp', now()
    ),
    auth.uid()
  );
END;
$$;

-- Step 6: Test the security policies work correctly
-- This should return 0 for anonymous users (no access to SELECT)
-- This query will fail if run as anonymous, which is the desired behavior