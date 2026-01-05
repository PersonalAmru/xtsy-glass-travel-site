-- Update create_booking_with_invoice function to accept user_id parameter
CREATE OR REPLACE FUNCTION public.create_booking_with_invoice(
  p_guest_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_check_in DATE,
  p_check_out DATE,
  p_room_name TEXT,
  p_room_type TEXT,
  p_quantity INTEGER,
  p_nights INTEGER,
  p_rate_per_night NUMERIC,
  p_subtotal NUMERIC,
  p_gst_rate NUMERIC,
  p_gst_amount NUMERIC,
  p_total_amount NUMERIC,
  p_message_to_host TEXT DEFAULT NULL,
  p_address TEXT DEFAULT NULL,
  p_city TEXT DEFAULT NULL,
  p_state TEXT DEFAULT NULL,
  p_pincode TEXT DEFAULT NULL,
  p_special_requests TEXT DEFAULT NULL,
  p_user_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_booking_id TEXT;
  v_invoice_number TEXT;
  v_booking_uuid UUID;
BEGIN
  -- Generate booking ID
  v_booking_id := generate_booking_id();
  
  -- Generate invoice number (same as booking ID for simplicity)
  v_invoice_number := v_booking_id;
  
  -- Insert booking with user_id
  INSERT INTO bookings (
    booking_id,
    guest_name,
    email,
    whatsapp_number,
    check_in,
    check_out,
    room_type,
    quantity,
    subtotal,
    taxes,
    total_amount,
    booking_status,
    special_requests,
    address,
    city,
    state,
    pincode,
    guests,
    user_id
  ) VALUES (
    v_booking_id,
    p_guest_name,
    p_email,
    p_phone,
    p_check_in,
    p_check_out,
    p_room_name,
    p_quantity,
    p_subtotal,
    p_gst_amount,
    p_total_amount,
    'pending',
    p_special_requests,
    p_address,
    p_city,
    p_state,
    p_pincode,
    p_quantity,
    p_user_id
  )
  RETURNING id INTO v_booking_uuid;
  
  -- Insert invoice
  INSERT INTO booking_invoices (
    booking_id,
    invoice_number,
    guest_name,
    guest_email,
    guest_phone,
    guest_address,
    guest_city,
    guest_state,
    guest_pincode,
    check_in,
    check_out,
    room_name,
    room_type,
    quantity,
    nights,
    rate_per_night,
    subtotal,
    gst_rate,
    gst_amount,
    total_amount,
    status
  ) VALUES (
    v_booking_id,
    v_invoice_number,
    p_guest_name,
    p_email,
    p_phone,
    p_address,
    p_city,
    p_state,
    p_pincode,
    p_check_in,
    p_check_out,
    p_room_name,
    p_room_type,
    p_quantity,
    p_nights,
    p_rate_per_night,
    p_subtotal,
    p_gst_rate,
    p_gst_amount,
    p_total_amount,
    'confirmed'
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'bookingId', v_booking_id,
    'bookingUUID', v_booking_uuid
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- Also allow users to see their own bookings
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  USING (
    user_id = auth.uid() 
    OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );