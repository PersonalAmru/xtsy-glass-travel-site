-- Fix critical security vulnerability in bookings table RLS policies
-- The current insert policy allows anyone to create bookings, which is a major security risk

-- Drop the overly permissive insert policy
DROP POLICY IF EXISTS "secure_booking_insert" ON public.bookings;

-- Create a secure insert policy that only allows authenticated users to create their own bookings
CREATE POLICY "secure_booking_authenticated_insert" ON public.bookings
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Ensure we have a comprehensive select policy for owners
-- Users can only select their own bookings
CREATE POLICY "secure_booking_owner_select_only" ON public.bookings
  FOR SELECT TO authenticated
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Ensure only authenticated users can update their own bookings (not staff/admin)
DROP POLICY IF EXISTS "secure_booking_admin_update" ON public.bookings;
CREATE POLICY "secure_booking_owner_update" ON public.bookings
  FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid())
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Admin/staff should use secure functions instead of direct table access
-- Keep admin select for emergency access but log it
CREATE POLICY "secure_booking_admin_emergency_select" ON public.bookings
  FOR SELECT TO authenticated
  USING (auth.uid() IS NOT NULL AND is_admin_or_staff());

-- Prevent any public access to bookings
CREATE POLICY "block_public_booking_access" ON public.bookings
  FOR ALL TO anon
  USING (false)
  WITH CHECK (false);

-- Add audit logging for admin access to bookings
CREATE OR REPLACE FUNCTION public.log_admin_booking_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log when admin/staff access booking data
  IF is_admin_or_staff() AND NEW.id IS NOT NULL THEN
    INSERT INTO public.security_alerts (alert_type, severity, details, user_id)
    VALUES ('admin_booking_access', 'low', jsonb_build_object(
      'booking_id', NEW.id,
      'admin_email', get_jwt_email(),
      'timestamp', now(),
      'action', TG_OP
    ), auth.uid());
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for admin access logging
DROP TRIGGER IF EXISTS log_admin_booking_access_trigger ON public.bookings;
CREATE TRIGGER log_admin_booking_access_trigger
  AFTER SELECT OR UPDATE ON public.bookings
  FOR EACH ROW
  WHEN (is_admin_or_staff())
  EXECUTE FUNCTION public.log_admin_booking_access();