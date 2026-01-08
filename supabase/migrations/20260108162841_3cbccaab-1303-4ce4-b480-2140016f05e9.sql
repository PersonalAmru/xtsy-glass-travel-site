-- Fix the approve function to use proper UUID type for audit_logs
CREATE OR REPLACE FUNCTION public.approve_booking_and_block_inventory(p_booking_id uuid, p_admin_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_booking RECORD;
  v_current_date DATE;
  v_room_type_id TEXT;
  v_dates_blocked INTEGER := 0;
  v_room_total_units INTEGER;
  v_quantity INTEGER;
BEGIN
  -- Get the booking
  SELECT * INTO v_booking
  FROM bookings
  WHERE id = p_booking_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Booking not found');
  END IF;
  
  IF v_booking.booking_status = 'confirmed' THEN
    RETURN json_build_object('success', false, 'error', 'Booking already confirmed');
  END IF;
  
  -- Resolve room type ID using the helper function
  v_room_type_id := resolve_room_type_id(COALESCE(v_booking.room_type_id, v_booking.room_type));
  
  IF v_room_type_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Could not resolve room type: ' || COALESCE(v_booking.room_type_id, v_booking.room_type, 'none specified'));
  END IF;
  
  -- Get quantity (default to 1)
  v_quantity := COALESCE(v_booking.quantity, 1);
  
  -- Get total units for this room type
  SELECT total_units INTO v_room_total_units 
  FROM room_types 
  WHERE id = v_room_type_id;
  
  IF v_room_total_units IS NULL THEN
    v_room_total_units := v_quantity;
  END IF;
  
  -- Update booking to confirmed with resolved room_type_id
  UPDATE bookings
  SET 
    booking_status = 'confirmed',
    approved_at = NOW(),
    approved_by = p_admin_id,
    confirmed_at = NOW(),
    room_type_id = v_room_type_id,
    updated_at = NOW()
  WHERE id = p_booking_id;
  
  -- Block dates for each date in the booking range
  v_current_date := v_booking.check_in::DATE;
  WHILE v_current_date < v_booking.check_out::DATE LOOP
    -- Insert blocking record for each date (using resolved ID)
    INSERT INTO blocked_dates (room_type, date, blocked, property_id)
    VALUES (v_room_type_id, v_current_date, true, v_booking.property_id)
    ON CONFLICT (room_type, date) 
    DO UPDATE SET blocked = true;
    
    -- Update room_inventory with available count
    INSERT INTO room_inventory (room_type_id, date, available_count, last_updated)
    VALUES (
      v_room_type_id, 
      v_current_date, 
      GREATEST(0, v_room_total_units - v_quantity),
      NOW()
    )
    ON CONFLICT (room_type_id, date) 
    DO UPDATE SET 
      available_count = GREATEST(0, room_inventory.available_count - v_quantity),
      last_updated = NOW();
    
    v_dates_blocked := v_dates_blocked + 1;
    v_current_date := v_current_date + INTERVAL '1 day';
  END LOOP;
  
  -- Send confirmation message to guest via booking chat
  INSERT INTO booking_messages (
    booking_id,
    sender_type,
    sender_name,
    sender_id,
    message,
    is_read
  ) VALUES (
    p_booking_id::TEXT,
    'admin',
    'XTSY Host',
    p_admin_id::TEXT,
    'Great news! Your booking has been confirmed. We look forward to hosting you from ' || 
    to_char(v_booking.check_in::DATE, 'Mon DD, YYYY') || ' to ' || 
    to_char(v_booking.check_out::DATE, 'Mon DD, YYYY') || '. See you soon!',
    false
  );
  
  -- Create admin notification
  INSERT INTO admin_notifications (
    type,
    title,
    message,
    booking_id,
    metadata
  ) VALUES (
    'booking_approved',
    'Booking Approved',
    format('Booking %s for %s has been approved', v_booking.booking_id, v_booking.guest_name),
    p_booking_id::TEXT,
    json_build_object(
      'room_type_id', v_room_type_id,
      'check_in', v_booking.check_in,
      'check_out', v_booking.check_out,
      'quantity', v_quantity,
      'dates_blocked', v_dates_blocked
    )
  );
  
  -- Log the approval action (using UUID directly)
  INSERT INTO audit_logs (
    action,
    table_name,
    record_id,
    user_id,
    new_values
  ) VALUES (
    'booking_approved',
    'bookings',
    p_booking_id,  -- UUID, not text
    p_admin_id,
    json_build_object(
      'booking_id', v_booking.booking_id,
      'room_type_id', v_room_type_id,
      'check_in', v_booking.check_in,
      'check_out', v_booking.check_out,
      'quantity', v_quantity,
      'dates_blocked', v_dates_blocked
    )
  );
  
  RETURN json_build_object(
    'success', true, 
    'booking_id', v_booking.booking_id,
    'room_type_id', v_room_type_id,
    'dates_blocked', v_dates_blocked
  );
  
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- Fix the deny function to use proper UUID type for audit_logs
CREATE OR REPLACE FUNCTION public.deny_booking_with_message(
  p_booking_id UUID,
  p_admin_id UUID,
  p_reason TEXT DEFAULT 'The requested dates are not available.'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_booking RECORD;
BEGIN
  -- Get the booking
  SELECT * INTO v_booking
  FROM bookings
  WHERE id = p_booking_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Booking not found');
  END IF;
  
  IF v_booking.booking_status = 'cancelled' THEN
    RETURN json_build_object('success', false, 'error', 'Booking already cancelled');
  END IF;
  
  -- Update booking to cancelled
  UPDATE bookings
  SET 
    booking_status = 'cancelled',
    cancelled_at = NOW(),
    updated_at = NOW()
  WHERE id = p_booking_id;
  
  -- Send denial message to guest via booking chat
  INSERT INTO booking_messages (
    booking_id,
    sender_type,
    sender_name,
    sender_id,
    message,
    is_read
  ) VALUES (
    p_booking_id::TEXT,
    'admin',
    'XTSY Host',
    p_admin_id::TEXT,
    'We''re sorry, but we are unable to confirm your booking for ' || 
    to_char(v_booking.check_in::DATE, 'Mon DD, YYYY') || ' to ' || 
    to_char(v_booking.check_out::DATE, 'Mon DD, YYYY') || '. ' || p_reason ||
    ' Please feel free to try different dates or contact us for assistance.',
    false
  );
  
  -- Create admin notification
  INSERT INTO admin_notifications (
    type,
    title,
    message,
    booking_id,
    metadata
  ) VALUES (
    'booking_denied',
    'Booking Denied',
    format('Booking %s for %s has been denied', v_booking.booking_id, v_booking.guest_name),
    p_booking_id::TEXT,
    json_build_object(
      'room_type', v_booking.room_type,
      'check_in', v_booking.check_in,
      'check_out', v_booking.check_out,
      'reason', p_reason
    )
  );
  
  -- Log the denial action (using UUID directly)
  INSERT INTO audit_logs (
    action,
    table_name,
    record_id,
    user_id,
    new_values
  ) VALUES (
    'booking_denied',
    'bookings',
    p_booking_id,  -- UUID, not text
    p_admin_id,
    json_build_object(
      'booking_id', v_booking.booking_id,
      'room_type', v_booking.room_type,
      'check_in', v_booking.check_in,
      'check_out', v_booking.check_out,
      'reason', p_reason
    )
  );
  
  RETURN json_build_object(
    'success', true, 
    'booking_id', v_booking.booking_id
  );
  
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;