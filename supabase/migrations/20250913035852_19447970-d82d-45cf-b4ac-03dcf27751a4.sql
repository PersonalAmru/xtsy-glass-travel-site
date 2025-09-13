-- Fix critical security vulnerability in bookings table RLS policies
-- The current insert policy allows anyone to create bookings, which is a major security risk

-- Drop the overly permissive insert policy
DROP POLICY IF EXISTS "secure_booking_insert" ON public.bookings;

-- Create a secure insert policy that only allows authenticated users to create their own bookings
CREATE POLICY "secure_booking_authenticated_insert" ON public.bookings
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Drop existing owner select policy to replace it
DROP POLICY IF EXISTS "secure_booking_owner_select" ON public.bookings;

-- Users can only select their own bookings
CREATE POLICY "secure_booking_owner_select_secure" ON public.bookings
  FOR SELECT TO authenticated
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Ensure only authenticated users can update their own bookings
DROP POLICY IF EXISTS "secure_booking_admin_update" ON public.bookings;
CREATE POLICY "secure_booking_owner_update" ON public.bookings
  FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid())
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Admin/staff emergency access (logged via existing functions)
CREATE POLICY "secure_booking_admin_emergency_select" ON public.bookings
  FOR SELECT TO authenticated
  USING (auth.uid() IS NOT NULL AND is_admin_or_staff());

-- Prevent any public/anonymous access to bookings
CREATE POLICY "block_public_booking_access" ON public.bookings
  FOR ALL TO anon
  USING (false)
  WITH CHECK (false);

-- Prevent any delete operations except by service role
CREATE POLICY "prevent_booking_delete" ON public.bookings
  FOR DELETE TO authenticated
  USING (false);

-- Update the booking access logging to track admin access attempts
CREATE OR REPLACE FUNCTION public.log_booking_access_attempt(p_booking_id uuid, p_access_type text, p_success boolean DEFAULT true)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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