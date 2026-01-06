-- Fix the approve_booking_and_block_inventory function
-- Only use blocked_dates table (which properly supports date-based blocking)
-- Don't try to insert into room_availability_status (which is room-type level status, not date-level)

CREATE OR REPLACE FUNCTION approve_booking_and_block_inventory(
  p_booking_id UUID,
  p_admin_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_booking RECORD;
  v_current_date DATE;
  v_room_type_identifier TEXT;
  v_dates_blocked INTEGER := 0;
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
  
  -- Use room_type_id if available, otherwise use room_type
  v_room_type_identifier := COALESCE(v_booking.room_type_id, v_booking.room_type);
  
  IF v_room_type_identifier IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Room type not specified');
  END IF;
  
  -- Update booking to confirmed
  UPDATE bookings
  SET 
    booking_status = 'confirmed',
    approved_at = NOW(),
    approved_by = p_admin_id,
    confirmed_at = NOW(),
    room_type_id = v_room_type_identifier,
    updated_at = NOW()
  WHERE id = p_booking_id;
  
  -- Block dates in blocked_dates table for each date in the booking range
  v_current_date := v_booking.check_in::DATE;
  WHILE v_current_date < v_booking.check_out::DATE LOOP
    -- Insert blocking record for each date
    INSERT INTO blocked_dates (room_type, date, blocked, property_id)
    VALUES (v_room_type_identifier, v_current_date, true, v_booking.property_id)
    ON CONFLICT (room_type, date) 
    DO UPDATE SET blocked = true;
    
    v_dates_blocked := v_dates_blocked + 1;
    v_current_date := v_current_date + INTERVAL '1 day';
  END LOOP;
  
  -- Update room_inventory to reduce available count (if table exists and has records)
  v_current_date := v_booking.check_in::DATE;
  WHILE v_current_date < v_booking.check_out::DATE LOOP
    -- Upsert inventory - decrement available count or create with 0
    INSERT INTO room_inventory (room_type_id, date, available_count, total_count, last_updated)
    VALUES (v_room_type_identifier, v_current_date, 0, COALESCE(v_booking.quantity, 1), NOW())
    ON CONFLICT (room_type_id, date) 
    DO UPDATE SET 
      available_count = GREATEST(0, room_inventory.available_count - COALESCE(v_booking.quantity, 1)),
      last_updated = NOW();
    
    v_current_date := v_current_date + INTERVAL '1 day';
  END LOOP;
  
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
      'room_type', v_room_type_identifier,
      'check_in', v_booking.check_in,
      'check_out', v_booking.check_out,
      'quantity', COALESCE(v_booking.quantity, 1),
      'dates_blocked', v_dates_blocked
    )
  );
  
  -- Log the approval action
  INSERT INTO audit_logs (
    action,
    table_name,
    record_id,
    user_id,
    new_values
  ) VALUES (
    'booking_approved',
    'bookings',
    p_booking_id::TEXT,
    p_admin_id,
    json_build_object(
      'booking_id', v_booking.booking_id,
      'room_type', v_room_type_identifier,
      'check_in', v_booking.check_in,
      'check_out', v_booking.check_out,
      'quantity', COALESCE(v_booking.quantity, 1),
      'dates_blocked', v_dates_blocked
    )
  );
  
  RETURN json_build_object(
    'success', true, 
    'booking_id', v_booking.booking_id,
    'room_type', v_room_type_identifier,
    'dates_blocked', v_dates_blocked
  );
  
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- Ensure execute permission
GRANT EXECUTE ON FUNCTION approve_booking_and_block_inventory(UUID, UUID) TO authenticated;