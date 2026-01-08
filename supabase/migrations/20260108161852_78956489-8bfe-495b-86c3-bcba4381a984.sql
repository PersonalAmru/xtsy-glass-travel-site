-- Fix 1: Add total_count column if missing in room_inventory
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'room_inventory' AND column_name = 'total_count'
  ) THEN
    ALTER TABLE room_inventory ADD COLUMN total_count INTEGER DEFAULT 1;
  END IF;
END $$;

-- Fix 2: Update resolve_room_type_id to handle generic categories like 'luxury', 'hostel', 'dorm'
CREATE OR REPLACE FUNCTION public.resolve_room_type_id(p_room_type text)
RETURNS text
LANGUAGE plpgsql
STABLE
AS $function$
DECLARE
  v_resolved_id TEXT;
BEGIN
  -- If null or empty, return null
  IF p_room_type IS NULL OR p_room_type = '' THEN
    RETURN NULL;
  END IF;
  
  -- Direct ID match
  IF EXISTS (SELECT 1 FROM room_types WHERE id = p_room_type) THEN
    RETURN p_room_type;
  END IF;
  
  -- Try matching by exact name (case-insensitive)
  SELECT id INTO v_resolved_id 
  FROM room_types 
  WHERE LOWER(name) = LOWER(p_room_type) 
  LIMIT 1;
  IF v_resolved_id IS NOT NULL THEN
    RETURN v_resolved_id;
  END IF;
  
  -- Legacy ID mappings and category mappings
  CASE LOWER(p_room_type)
    -- Category-based mappings (when user just selects "luxury", "hostel", etc.)
    WHEN 'luxury' THEN RETURN 'xtsy-270';
    WHEN 'hostel' THEN RETURN '4-bed-mixed-female-dorm';
    WHEN 'dorm' THEN RETURN '6-bed-mixed-dorm';
    WHEN 'economy' THEN RETURN '8-bed-mixed-economy-dorm';
    -- Specific legacy mappings
    WHEN '6-bed-female-dorm' THEN RETURN '6-bed-mixed-female-dorm';
    WHEN 'bed in 4-bed female dormitory' THEN RETURN '4-bed-female-only-dorm';
    WHEN 'bed in 4-bed mixed dormitory' THEN RETURN '4-bed-mixed-female-dorm';
    WHEN 'bed in 6-bed female dormitory' THEN RETURN '6-bed-mixed-female-dorm';
    WHEN 'bed in 6-bed mixed dormitory' THEN RETURN '6-bed-mixed-dorm';
    WHEN 'king double room' THEN RETURN 'king-double-room';
    WHEN 'king triple room' THEN RETURN 'king-triple-room';
    WHEN '270° panorama glass ensuite' THEN RETURN 'xtsy-270';
    WHEN 'xtsy 270° panorama glass ensuite' THEN RETURN 'xtsy-270';
    WHEN 'bed in 8-bed mixed dormitory' THEN RETURN '8-bed-mixed-economy-dorm';
    ELSE NULL;
  END CASE;
  
  -- Try partial name matching as last resort
  SELECT id INTO v_resolved_id 
  FROM room_types 
  WHERE LOWER(name) LIKE '%' || LOWER(p_room_type) || '%'
  LIMIT 1;
  IF v_resolved_id IS NOT NULL THEN
    RETURN v_resolved_id;
  END IF;
  
  -- Return NULL if no match found
  RETURN NULL;
END;
$function$;

-- Fix 3: Update approve function to handle missing total_count gracefully
CREATE OR REPLACE FUNCTION public.approve_booking_and_block_inventory(p_booking_id uuid, p_admin_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;