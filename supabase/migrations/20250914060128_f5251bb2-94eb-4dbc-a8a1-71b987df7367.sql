-- Fix the security definer view issue by removing problematic view
-- and ensuring secure access through functions only

-- Drop the problematic view that uses security definer functions
DROP VIEW IF EXISTS public.bookings_masked_secure;

-- Drop the old logging function as it's not needed
DROP FUNCTION IF EXISTS public.log_sensitive_data_access();

-- Update the existing secure function to provide all necessary data masking
-- This function already exists and provides secure access
CREATE OR REPLACE FUNCTION public.get_bookings_masked_secure()
RETURNS TABLE(
  id uuid, booking_id text, guest_name text, email text, whatsapp_number text,
  check_in date, check_out date, guests integer, total_amount integer,
  room_type text, booking_status text, payment_status text, created_at timestamp with time zone,
  user_id uuid, address text, city text, state text, pincode text,
  emergency_contact text, special_requests text, source text,
  subtotal integer, taxes integer, updated_at timestamp with time zone,
  confirmed_at timestamp with time zone, cancelled_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_role TEXT;
  current_user_id UUID;
BEGIN
  -- Get current user info
  current_user_id := auth.uid();
  user_role := get_user_role();
  
  -- Only allow authenticated users
  IF current_user_id IS NULL THEN
    RETURN;
  END IF;
  
  -- Log access to sensitive data
  PERFORM log_booking_access_attempt(null, 'masked_view_access', true);
  
  -- Admin/staff can see all data with minimal masking, regular users only their own with full masking
  IF user_role IN ('admin', 'staff') THEN
    RETURN QUERY
    SELECT 
      b.id, b.booking_id, b.guest_name,
      b.email, -- Admin sees full email
      b.whatsapp_number, -- Admin sees full WhatsApp
      b.check_in, b.check_out, b.guests, b.total_amount,
      b.room_type, b.booking_status, b.payment_status, b.created_at,
      b.user_id,
      b.address, -- Admin sees full address
      b.city, b.state, b.pincode,
      b.emergency_contact, -- Admin sees full emergency contact
      b.special_requests, b.source,
      b.subtotal, b.taxes, b.updated_at, b.confirmed_at, b.cancelled_at
    FROM public.bookings b;
  ELSE
    RETURN QUERY
    SELECT 
      b.id, b.booking_id, b.guest_name,
      -- Mask email for regular users
      REGEXP_REPLACE(b.email, '(.{2}).*(@.*)', '\1***\2') as email,
      -- Mask WhatsApp number for regular users  
      REGEXP_REPLACE(b.whatsapp_number, '(.{3}).*(.{2})$', '\1***\2') as whatsapp_number,
      b.check_in, b.check_out, b.guests, b.total_amount,
      b.room_type, b.booking_status, b.payment_status, b.created_at,
      b.user_id,
      -- Mask address for regular users
      LEFT(COALESCE(b.address, ''), 20) || CASE WHEN LENGTH(COALESCE(b.address, '')) > 20 THEN '...' ELSE '' END as address,
      b.city, b.state, b.pincode,
      -- Mask emergency contact for regular users
      REGEXP_REPLACE(COALESCE(b.emergency_contact, ''), '(.{3}).*(.{2})$', '\1***\2') as emergency_contact,
      b.special_requests, b.source,
      b.subtotal, b.taxes, b.updated_at, b.confirmed_at, b.cancelled_at
    FROM public.bookings b 
    WHERE b.user_id = current_user_id; -- Users only see their own data
  END IF;
END;
$$;