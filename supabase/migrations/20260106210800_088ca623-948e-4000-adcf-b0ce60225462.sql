-- Drop and recreate the approve_booking function to handle NULL room_type_id
-- by falling back to room_type field

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
  v_room_type_id TEXT;
  v_result JSON;
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
  v_room_type_id := COALESCE(v_booking.room_type_id, v_booking.room_type);
  
  IF v_room_type_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Room type not specified');
  END IF;
  
  -- Update booking to confirmed
  UPDATE bookings
  SET 
    booking_status = 'confirmed',
    approved_at = NOW(),
    approved_by = p_admin_id,
    confirmed_at = NOW(),
    room_type_id = v_room_type_id
  WHERE id = p_booking_id;
  
  -- Block inventory for each date in the booking range
  v_current_date := v_booking.check_in::DATE;
  WHILE v_current_date < v_booking.check_out::DATE LOOP
    -- Insert or update room_inventory to reduce available count
    INSERT INTO room_inventory (room_type_id, date, available_count)
    VALUES (v_room_type_id, v_current_date, -COALESCE(v_booking.quantity, 1))
    ON CONFLICT (room_type_id, date) 
    DO UPDATE SET 
      available_count = room_inventory.available_count - COALESCE(v_booking.quantity, 1),
      updated_at = NOW();
    
    v_current_date := v_current_date + INTERVAL '1 day';
  END LOOP;
  
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
      'room_type_id', v_room_type_id,
      'check_in', v_booking.check_in,
      'check_out', v_booking.check_out,
      'quantity', COALESCE(v_booking.quantity, 1)
    )
  );
  
  RETURN json_build_object(
    'success', true, 
    'booking_id', v_booking.booking_id,
    'room_type_id', v_room_type_id,
    'dates_blocked', v_booking.check_out::DATE - v_booking.check_in::DATE
  );
  
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION approve_booking_and_block_inventory(UUID, UUID) TO authenticated;