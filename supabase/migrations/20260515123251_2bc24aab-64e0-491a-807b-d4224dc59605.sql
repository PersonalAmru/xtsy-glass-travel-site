CREATE OR REPLACE FUNCTION public.create_booking_secure(
  p_guest_name TEXT,
  p_email TEXT,
  p_whatsapp_number TEXT,
  p_check_in DATE,
  p_check_out DATE,
  p_guests INTEGER,
  p_room_type TEXT,
  p_room_type_id TEXT,
  p_quantity INTEGER,
  p_subtotal INTEGER,
  p_taxes INTEGER,
  p_total_amount INTEGER,
  p_address TEXT DEFAULT NULL,
  p_city TEXT DEFAULT NULL,
  p_state TEXT DEFAULT NULL,
  p_pincode TEXT DEFAULT NULL,
  p_special_requests TEXT DEFAULT NULL,
  p_emergency_contact TEXT DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_booking_id TEXT;
  v_booking_uuid UUID;
  v_actual_price INTEGER;
  v_nights INTEGER;
  v_expected_subtotal INTEGER;
  v_suspicious_count INTEGER;
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();

  -- Basic validation
  IF p_guest_name IS NULL OR length(trim(p_guest_name)) < 2 THEN
    RETURN json_build_object('success', false, 'error', 'Invalid guest name');
  END IF;
  IF p_email IS NULL OR p_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RETURN json_build_object('success', false, 'error', 'Invalid email');
  END IF;
  IF p_whatsapp_number IS NULL OR length(regexp_replace(p_whatsapp_number, '\D', '', 'g')) < 10 THEN
    RETURN json_build_object('success', false, 'error', 'Invalid WhatsApp number');
  END IF;

  v_nights := (p_check_out - p_check_in);
  IF v_nights < 1 THEN
    RETURN json_build_object('success', false, 'error', 'Invalid date range');
  END IF;
  IF p_check_in < CURRENT_DATE THEN
    RETURN json_build_object('success', false, 'error', 'Check-in must be in the future');
  END IF;
  IF p_quantity < 1 OR p_quantity > 10 THEN
    RETURN json_build_object('success', false, 'error', 'Invalid quantity');
  END IF;

  -- Availability
  IF p_room_type_id IS NOT NULL AND NOT is_room_available(p_room_type_id, p_check_in, p_check_out, p_quantity) THEN
    RETURN json_build_object('success', false, 'error', 'Room not available for selected dates');
  END IF;

  -- Server-side price validation: subtotal = base_price * nights * quantity
  IF p_room_type_id IS NOT NULL THEN
    SELECT base_price INTO v_actual_price
    FROM room_types
    WHERE id = p_room_type_id AND is_active = true;

    IF v_actual_price IS NULL THEN
      RETURN json_build_object('success', false, 'error', 'Invalid room type');
    END IF;

    v_expected_subtotal := v_actual_price * v_nights * p_quantity;

    -- Allow 2% tolerance for rounding
    IF ABS(p_subtotal - v_expected_subtotal) > GREATEST(50, (v_expected_subtotal * 0.02)::INTEGER) THEN
      RETURN json_build_object(
        'success', false,
        'error', 'Price mismatch detected',
        'expected_subtotal', v_expected_subtotal,
        'received_subtotal', p_subtotal
      );
    END IF;

    -- Total must equal subtotal + taxes (1% tolerance)
    IF ABS(p_total_amount - (p_subtotal + p_taxes)) > GREATEST(10, (p_total_amount * 0.01)::INTEGER) THEN
      RETURN json_build_object(
        'success', false,
        'error', 'Total amount mismatch',
        'expected', p_subtotal + p_taxes,
        'received', p_total_amount
      );
    END IF;

    -- GST sanity: 0% (dorm) up to 18% allowed
    IF p_taxes < 0 OR p_taxes > (p_subtotal * 0.20)::INTEGER THEN
      RETURN json_build_object('success', false, 'error', 'Invalid tax amount');
    END IF;
  END IF;

  -- Rate limit
  SELECT COUNT(*) INTO v_suspicious_count
  FROM bookings
  WHERE lower(trim(email)) = lower(trim(p_email))
    AND created_at > NOW() - INTERVAL '1 hour';
  IF v_suspicious_count >= 5 THEN
    RETURN json_build_object('success', false, 'error', 'Too many booking attempts. Please wait and try again.');
  END IF;

  v_booking_id := 'XTSY' || to_char(NOW(), 'YYMMDD') || lpad((floor(random() * 10000))::text, 4, '0');

  INSERT INTO bookings (
    booking_id, user_id, guest_name, email, whatsapp_number,
    check_in, check_out, guests, room_type, room_type_id, quantity,
    subtotal, taxes, total_amount, address, city, state, pincode,
    special_requests, emergency_contact, status, payment_status, source
  ) VALUES (
    v_booking_id, v_user_id, p_guest_name, p_email, p_whatsapp_number,
    p_check_in, p_check_out, p_guests, p_room_type, p_room_type_id, p_quantity,
    p_subtotal, p_taxes, p_total_amount, p_address, p_city, p_state, p_pincode,
    p_special_requests, p_emergency_contact, 'pending_approval', 'pay_at_hotel', 'website'
  )
  RETURNING id INTO v_booking_uuid;

  RETURN json_build_object(
    'success', true,
    'bookingId', v_booking_id,
    'bookingUUID', v_booking_uuid
  );
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', 'Failed to create booking: ' || SQLERRM);
END;
$$;