-- Drop existing function and recreate with booking insertion
DROP FUNCTION IF EXISTS public.create_booking_with_invoice(text, text, text, date, date, text, text, integer, integer, integer, integer, numeric, integer, integer, text, text, text, text, text, text);
DROP FUNCTION IF EXISTS public.create_booking_with_invoice(text, text, text, date, date, text, text, integer, integer, integer, integer, numeric, integer, integer, text, text, text, text, text, text, uuid);

CREATE OR REPLACE FUNCTION public.create_booking_with_invoice(
  p_guest_name text,
  p_email text,
  p_phone text,
  p_check_in date,
  p_check_out date,
  p_room_name text,
  p_room_type text,
  p_quantity integer,
  p_nights integer,
  p_rate_per_night integer,
  p_subtotal integer,
  p_gst_rate numeric,
  p_gst_amount integer,
  p_total_amount integer,
  p_message_to_host text,
  p_address text DEFAULT NULL,
  p_city text DEFAULT NULL,
  p_state text DEFAULT NULL,
  p_pincode text DEFAULT NULL,
  p_special_requests text DEFAULT NULL,
  p_user_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_booking_id TEXT;
  invoice_id UUID;
  booking_uuid UUID;
BEGIN
  -- Generate sequential booking ID
  new_booking_id := public.generate_booking_id();
  
  -- Generate UUID for the booking
  booking_uuid := gen_random_uuid();
  
  -- Create booking record in bookings table
  INSERT INTO public.bookings (
    id,
    booking_id,
    guest_name,
    email,
    whatsapp_number,
    check_in,
    check_out,
    room_type,
    guests,
    quantity,
    subtotal,
    taxes,
    total_amount,
    booking_status,
    address,
    city,
    state,
    pincode,
    special_requests,
    user_id,
    host_message,
    source
  ) VALUES (
    booking_uuid,
    new_booking_id,
    p_guest_name,
    p_email,
    p_phone,
    p_check_in,
    p_check_out,
    p_room_name,
    p_quantity,  -- guests = quantity for simplicity
    p_quantity,
    p_subtotal,
    p_gst_amount,
    p_total_amount,
    'pending',  -- Start as pending, host needs to approve
    p_address,
    p_city,
    p_state,
    p_pincode,
    p_special_requests,
    p_user_id,
    p_message_to_host,
    'website'
  );
  
  -- Create invoice record
  INSERT INTO public.booking_invoices (
    booking_id, invoice_number, guest_name, guest_email, guest_phone,
    guest_address, guest_city, guest_state, guest_pincode,
    check_in, check_out, room_name, room_type, quantity, nights,
    rate_per_night, subtotal, gst_rate, gst_amount, total_amount, status
  ) VALUES (
    new_booking_id, new_booking_id, p_guest_name, p_email, p_phone,
    p_address, p_city, p_state, p_pincode,
    p_check_in, p_check_out, p_room_name, p_room_type, p_quantity, p_nights,
    p_rate_per_night, p_subtotal, p_gst_rate, p_gst_amount, p_total_amount, 'confirmed'
  )
  RETURNING id INTO invoice_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'bookingId', new_booking_id,
    'bookingUUID', booking_uuid,
    'invoiceId', invoice_id
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- Also update the get_booking_calendar function to fetch all bookings for a date range
-- Including pending, confirmed, cancelled, and no_show statuses
DROP FUNCTION IF EXISTS public.get_booking_calendar(date, date);

CREATE OR REPLACE FUNCTION public.get_booking_calendar(
  p_start_date date,
  p_end_date date
)
RETURNS TABLE (
  id uuid,
  booking_id text,
  guest_name text,
  email text,
  room_type text,
  check_in date,
  check_out date,
  booking_status text,
  approved_at timestamptz,
  no_show_marked_at timestamptz,
  quantity integer,
  total_amount numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.booking_id,
    b.guest_name,
    b.email,
    b.room_type,
    b.check_in,
    b.check_out,
    b.booking_status,
    b.approved_at,
    b.no_show_marked_at,
    b.quantity,
    b.total_amount
  FROM public.bookings b
  WHERE 
    -- Include all bookings where any part of the stay overlaps with the date range
    (b.check_in <= p_end_date AND b.check_out >= p_start_date)
    -- Include all statuses for visibility
    AND b.booking_status IN ('pending', 'confirmed', 'cancelled', 'no_show', 'completed')
  ORDER BY b.check_in ASC, b.created_at ASC;
END;
$$;