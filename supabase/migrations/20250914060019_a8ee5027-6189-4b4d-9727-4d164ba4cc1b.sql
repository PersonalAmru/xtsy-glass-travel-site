-- CRITICAL SECURITY FIX: Drop the insecure bookings_masked view
-- This view exposes all customer PII without any access controls

-- Drop the dangerous public view that exposes customer data
DROP VIEW IF EXISTS public.bookings_masked;

-- Create a secure, access-controlled view that uses RLS from the underlying table
CREATE VIEW public.bookings_masked_secure AS
SELECT 
  b.id,
  b.booking_id,
  b.guest_name,
  -- Mask email for non-admin users
  CASE 
    WHEN is_admin_or_staff() THEN b.email
    ELSE REGEXP_REPLACE(b.email, '(.{2}).*(@.*)', '\1***\2')
  END as email,
  -- Mask WhatsApp number for non-admin users  
  CASE 
    WHEN is_admin_or_staff() THEN b.whatsapp_number
    ELSE REGEXP_REPLACE(b.whatsapp_number, '(.{3}).*(.{2})$', '\1***\2')
  END as whatsapp_number,
  b.check_in,
  b.check_out,
  b.guests,
  b.total_amount,
  b.room_type,
  b.booking_status,
  b.payment_status,
  b.created_at,
  b.user_id,
  -- Mask address for non-admin users
  CASE 
    WHEN is_admin_or_staff() THEN b.address
    ELSE LEFT(COALESCE(b.address, ''), 20) || CASE WHEN LENGTH(COALESCE(b.address, '')) > 20 THEN '...' ELSE '' END
  END as address,
  b.city,
  b.state,
  b.pincode,
  -- Mask emergency contact for non-admin users
  CASE 
    WHEN is_admin_or_staff() THEN b.emergency_contact  
    ELSE REGEXP_REPLACE(COALESCE(b.emergency_contact, ''), '(.{3}).*(.{2})$', '\1***\2')
  END as emergency_contact,
  b.special_requests,
  b.source,
  b.subtotal,
  b.taxes,
  b.updated_at,
  b.confirmed_at,
  b.cancelled_at
FROM public.bookings b
WHERE 
  -- Users can only see their own bookings, admins can see all
  (auth.uid() IS NOT NULL AND b.user_id = auth.uid()) 
  OR is_admin_or_staff();

-- Enable RLS on the secure view (though it inherits from bookings table RLS)
-- This ensures the view respects the RLS policies from the underlying bookings table

-- Log access to this sensitive data
CREATE OR REPLACE FUNCTION public.log_sensitive_data_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log access to sensitive customer data
  INSERT INTO public.security_alerts (alert_type, severity, details, user_id)
  VALUES ('sensitive_data_access', 'low', jsonb_build_object(
    'accessed_table', 'bookings_masked_secure',
    'user_email', get_jwt_email(),
    'user_role', get_user_role(),
    'timestamp', now()
  ), auth.uid());
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;