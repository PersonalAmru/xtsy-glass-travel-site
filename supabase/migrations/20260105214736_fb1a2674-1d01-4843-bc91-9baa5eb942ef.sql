-- Add booking approval fields to bookings table
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS approved_by UUID,
ADD COLUMN IF NOT EXISTS no_show_marked_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS no_show_marked_by UUID,
ADD COLUMN IF NOT EXISTS host_message TEXT;

-- Create index for faster booking calendar queries
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON public.bookings(check_in, check_out, booking_status);
CREATE INDEX IF NOT EXISTS idx_bookings_approval ON public.bookings(booking_status, approved_at);

-- Function to approve booking and block inventory
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
  
  -- Update booking to confirmed
  UPDATE bookings
  SET 
    booking_status = 'confirmed',
    approved_at = NOW(),
    approved_by = p_admin_id,
    confirmed_at = NOW()
  WHERE id = p_booking_id;
  
  -- Block inventory for each date in the booking range
  v_current_date := v_booking.check_in::DATE;
  WHILE v_current_date < v_booking.check_out::DATE LOOP
    -- Insert or update room_inventory to reduce available count
    INSERT INTO room_inventory (room_type_id, date, available_count)
    VALUES (v_booking.room_type_id, v_current_date, -COALESCE(v_booking.quantity, 1))
    ON CONFLICT (room_type_id, date) 
    DO UPDATE SET 
      available_count = room_inventory.available_count - COALESCE(v_booking.quantity, 1),
      updated_at = NOW();
    
    v_current_date := v_current_date + INTERVAL '1 day';
  END LOOP;
  
  -- Create admin notification
  INSERT INTO admin_notifications (type, title, message, booking_id, metadata)
  VALUES (
    'booking_confirmed',
    'Booking Confirmed',
    'Booking ' || v_booking.booking_id || ' has been confirmed and inventory blocked.',
    p_booking_id,
    jsonb_build_object('guest_name', v_booking.guest_name, 'check_in', v_booking.check_in, 'check_out', v_booking.check_out)
  );
  
  RETURN json_build_object('success', true, 'booking_id', v_booking.booking_id);
END;
$$;

-- Function to mark booking as no-show
CREATE OR REPLACE FUNCTION mark_booking_no_show(
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
  v_hours_since_checkin NUMERIC;
BEGIN
  -- Get the booking
  SELECT * INTO v_booking
  FROM bookings
  WHERE id = p_booking_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Booking not found');
  END IF;
  
  -- Check if within 48 hours window
  v_hours_since_checkin := EXTRACT(EPOCH FROM (NOW() - v_booking.check_in::TIMESTAMP)) / 3600;
  
  IF v_hours_since_checkin > 48 THEN
    RETURN json_build_object('success', false, 'error', 'No-show can only be marked within 48 hours of check-in');
  END IF;
  
  IF v_hours_since_checkin < 0 THEN
    RETURN json_build_object('success', false, 'error', 'Cannot mark no-show before check-in date');
  END IF;
  
  -- Update booking
  UPDATE bookings
  SET 
    booking_status = 'no_show',
    no_show_marked_at = NOW(),
    no_show_marked_by = p_admin_id
  WHERE id = p_booking_id;
  
  -- Create notification
  INSERT INTO admin_notifications (type, title, message, booking_id)
  VALUES (
    'booking_no_show',
    'No-Show Marked',
    'Booking ' || v_booking.booking_id || ' marked as no-show.',
    p_booking_id
  );
  
  RETURN json_build_object('success', true, 'booking_id', v_booking.booking_id);
END;
$$;

-- Function to get booking calendar data for a date range
CREATE OR REPLACE FUNCTION get_booking_calendar(
  p_start_date DATE,
  p_end_date DATE,
  p_property_id UUID DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_agg(
    json_build_object(
      'id', b.id,
      'booking_id', b.booking_id,
      'guest_name', b.guest_name,
      'email', b.email,
      'room_type', b.room_type,
      'check_in', b.check_in,
      'check_out', b.check_out,
      'booking_status', b.booking_status,
      'approved_at', b.approved_at,
      'no_show_marked_at', b.no_show_marked_at,
      'quantity', b.quantity,
      'total_amount', b.total_amount
    )
  ) INTO v_result
  FROM bookings b
  WHERE b.check_in::DATE <= p_end_date
    AND b.check_out::DATE >= p_start_date
    AND (p_property_id IS NULL OR b.property_id = p_property_id)
    AND b.booking_status NOT IN ('cancelled');
  
  RETURN COALESCE(v_result, '[]'::JSON);
END;
$$;