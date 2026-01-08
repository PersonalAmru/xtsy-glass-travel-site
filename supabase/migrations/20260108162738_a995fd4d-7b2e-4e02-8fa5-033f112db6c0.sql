-- Fix the admin_notifications type constraint to allow booking_approved and booking_denied
ALTER TABLE admin_notifications DROP CONSTRAINT admin_notifications_type_check;

ALTER TABLE admin_notifications ADD CONSTRAINT admin_notifications_type_check 
CHECK (type = ANY (ARRAY[
  'new_booking'::text, 
  'new_message'::text, 
  'booking_update'::text, 
  'payment_received'::text,
  'booking_approved'::text,
  'booking_denied'::text,
  'no_show'::text
]));

-- Also verify and update the deny function if needed
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
  
  -- Log the denial action
  INSERT INTO audit_logs (
    action,
    table_name,
    record_id,
    user_id,
    new_values
  ) VALUES (
    'booking_denied',
    'bookings',
    p_booking_id::TEXT,
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