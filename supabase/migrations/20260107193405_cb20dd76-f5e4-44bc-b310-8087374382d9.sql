
-- Create a room type resolution function in the database
CREATE OR REPLACE FUNCTION resolve_room_type_id(p_room_type TEXT)
RETURNS TEXT
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_resolved_id TEXT;
BEGIN
  -- Direct ID match
  IF EXISTS (SELECT 1 FROM room_types WHERE id = p_room_type) THEN
    RETURN p_room_type;
  END IF;
  
  -- Try matching by name
  SELECT id INTO v_resolved_id FROM room_types WHERE name = p_room_type LIMIT 1;
  IF v_resolved_id IS NOT NULL THEN
    RETURN v_resolved_id;
  END IF;
  
  -- Legacy ID mappings
  CASE p_room_type
    WHEN '6-bed-female-dorm' THEN RETURN '6-bed-mixed-female-dorm';
    WHEN 'Bed in 4-Bed Female Dormitory' THEN RETURN '4-bed-female-only-dorm';
    WHEN 'Bed in 4-Bed Mixed Dormitory' THEN RETURN '4-bed-mixed-female-dorm';
    WHEN 'Bed in 6-Bed Female Dormitory' THEN RETURN '6-bed-mixed-female-dorm';
    WHEN 'Bed in 6-Bed Mixed Dormitory' THEN RETURN '6-bed-mixed-dorm';
    WHEN 'King Double Room' THEN RETURN 'king-double-room';
    WHEN 'King Triple Room' THEN RETURN 'king-triple-room';
    WHEN '270° Panorama Glass Ensuite' THEN RETURN 'xtsy-270';
    WHEN 'XTSY 270° Panorama Glass Ensuite' THEN RETURN 'xtsy-270';
    WHEN 'Bed in 8-Bed Mixed Dormitory' THEN RETURN '8-bed-mixed-economy-dorm';
    ELSE NULL;
  END CASE;
  
  -- Return original if no match (caller should handle)
  RETURN p_room_type;
END;
$$;

-- Update the approve_booking_and_block_inventory function to use resolved IDs
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
  v_dates_blocked INTEGER := 0;
  v_room_total_units INTEGER;
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
    RETURN json_build_object('success', false, 'error', 'Room type not specified');
  END IF;
  
  -- Get total units for this room type
  SELECT total_units INTO v_room_total_units 
  FROM room_types 
  WHERE id = v_room_type_id;
  
  IF v_room_total_units IS NULL THEN
    v_room_total_units := COALESCE(v_booking.quantity, 1);
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
    INSERT INTO room_inventory (room_type_id, date, available_count, total_count, last_updated)
    VALUES (
      v_room_type_id, 
      v_current_date, 
      GREATEST(0, v_room_total_units - COALESCE(v_booking.quantity, 1)),
      v_room_total_units,
      NOW()
    )
    ON CONFLICT (room_type_id, date) 
    DO UPDATE SET 
      available_count = GREATEST(0, room_inventory.available_count - COALESCE(v_booking.quantity, 1)),
      last_updated = NOW();
    
    v_dates_blocked := v_dates_blocked + 1;
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
      'room_type_id', v_room_type_id,
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
      'room_type_id', v_room_type_id,
      'check_in', v_booking.check_in,
      'check_out', v_booking.check_out,
      'quantity', COALESCE(v_booking.quantity, 1),
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
