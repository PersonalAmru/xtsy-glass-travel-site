-- Drop ALL existing versions of the function to resolve ambiguity
DROP FUNCTION IF EXISTS public.create_booking_with_invoice(text, text, text, date, date, text, text, integer, integer, integer, integer, numeric, integer, integer, text, text, text, text, text, text, uuid);
DROP FUNCTION IF EXISTS public.create_booking_with_invoice(text, text, text, date, date, text, text, integer, integer, numeric, numeric, numeric, numeric, numeric, text, text, text, text, text, text, uuid);

-- Create single unified function with numeric types
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
  p_rate_per_night numeric,
  p_subtotal numeric,
  p_gst_rate numeric,
  p_gst_amount numeric,
  p_total_amount numeric,
  p_message_to_host text DEFAULT NULL,
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
SET search_path = public
AS $$
DECLARE
  v_booking_id text;
  v_booking_uuid uuid;
  v_invoice_id uuid;
  v_counter integer;
BEGIN
  -- Generate booking ID (XTH-INV-XXX format)
  UPDATE invoice_counter 
  SET counter = counter + 1, updated_at = now()
  WHERE prefix = 'XTH'
  RETURNING counter INTO v_counter;
  
  IF v_counter IS NULL THEN
    INSERT INTO invoice_counter (prefix, counter) VALUES ('XTH', 1)
    RETURNING counter INTO v_counter;
  END IF;
  
  v_booking_id := 'XTH-INV-' || LPAD(v_counter::text, 3, '0');
  v_booking_uuid := gen_random_uuid();
  
  -- Insert into bookings table
  INSERT INTO public.bookings (
    id, booking_id, guest_name, email, whatsapp_number,
    check_in, check_out, room_type, quantity, guests,
    subtotal, taxes, total_amount, booking_status,
    special_requests, address, city, state, pincode,
    user_id, created_at, updated_at
  ) VALUES (
    v_booking_uuid, v_booking_id, p_guest_name, p_email, p_phone,
    p_check_in, p_check_out, p_room_type, p_quantity, p_quantity,
    p_subtotal, p_gst_amount, p_total_amount, 'pending',
    p_special_requests, p_address, p_city, p_state, p_pincode,
    p_user_id, now(), now()
  );
  
  -- Insert into booking_invoices table
  INSERT INTO public.booking_invoices (
    booking_id, invoice_number, guest_name, guest_email, guest_phone,
    guest_address, guest_city, guest_state, guest_pincode,
    check_in, check_out, room_name, room_type, quantity, nights,
    rate_per_night, subtotal, gst_rate, gst_amount, total_amount, status
  ) VALUES (
    v_booking_id, v_booking_id, p_guest_name, p_email, p_phone,
    p_address, p_city, p_state, p_pincode,
    p_check_in, p_check_out, p_room_name, p_room_type, p_quantity, p_nights,
    p_rate_per_night, p_subtotal, p_gst_rate, p_gst_amount, p_total_amount, 'pending'
  )
  RETURNING id INTO v_invoice_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'bookingId', v_booking_id,
    'bookingUUID', v_booking_uuid,
    'invoiceId', v_invoice_id
  );
  
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM
  );
END;
$$;