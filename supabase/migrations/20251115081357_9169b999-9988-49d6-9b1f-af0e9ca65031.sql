-- Fix Critical Booking Data Exposure Vulnerability
-- This migration secures the booking process by:
-- 1. Revoking direct INSERT access from anonymous users
-- 2. Creating a secure function with validation
-- 3. Adding rate limiting and fraud detection

-- Step 1: Drop the permissive anonymous insert policies
DROP POLICY IF EXISTS "bookings_anonymous_insert" ON public.bookings;
DROP POLICY IF EXISTS "bookings_anonymous_insert_with_availability" ON public.bookings;

-- Step 2: Revoke INSERT permission from anonymous role
REVOKE INSERT ON public.bookings FROM anon;

-- Step 3: Create secure booking function with validation
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
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_booking_id TEXT;
  v_new_booking_id UUID;
  v_actual_price INTEGER;
  v_calculated_total INTEGER;
  v_nights INTEGER;
  v_suspicious_count INTEGER;
BEGIN
  -- Validation 1: Input sanitization and length checks
  IF LENGTH(TRIM(p_guest_name)) < 2 OR LENGTH(TRIM(p_guest_name)) > 100 THEN
    RETURN json_build_object('success', false, 'error', 'Invalid guest name');
  END IF;
  
  IF p_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RETURN json_build_object('success', false, 'error', 'Invalid email format');
  END IF;
  
  IF p_whatsapp_number !~ '^\+?[1-9]\d{7,14}$' THEN
    RETURN json_build_object('success', false, 'error', 'Invalid phone number');
  END IF;
  
  -- Validation 2: Date validation
  IF p_check_in < CURRENT_DATE THEN
    RETURN json_build_object('success', false, 'error', 'Check-in date must be in the future');
  END IF;
  
  IF p_check_out <= p_check_in THEN
    RETURN json_build_object('success', false, 'error', 'Check-out must be after check-in');
  END IF;
  
  v_nights := p_check_out - p_check_in;
  IF v_nights > 30 THEN
    RETURN json_build_object('success', false, 'error', 'Maximum stay is 30 nights');
  END IF;
  
  -- Validation 3: Guest count validation
  IF p_guests < 1 OR p_guests > 20 THEN
    RETURN json_build_object('success', false, 'error', 'Invalid number of guests');
  END IF;
  
  IF p_quantity < 1 OR p_quantity > 10 THEN
    RETURN json_build_object('success', false, 'error', 'Invalid quantity');
  END IF;
  
  -- Validation 4: Check room availability
  IF NOT is_room_available(p_room_type_id, p_check_in, p_check_out, p_quantity) THEN
    RETURN json_build_object('success', false, 'error', 'Room not available for selected dates');
  END IF;
  
  -- Validation 5: Server-side price validation to prevent price manipulation
  SELECT base_price INTO v_actual_price
  FROM room_types
  WHERE id = p_room_type_id AND is_active = true;
  
  IF v_actual_price IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Invalid room type');
  END IF;
  
  -- Calculate expected total (simplified - adjust based on your pricing logic)
  v_calculated_total := (v_actual_price * v_nights * p_quantity);
  v_calculated_total := v_calculated_total + (v_calculated_total * 12 / 100); -- Add 12% GST
  
  -- Allow 1% tolerance for rounding differences
  IF ABS(p_total_amount - v_calculated_total) > (v_calculated_total * 0.01) THEN
    RETURN json_build_object(
      'success', false, 
      'error', 'Price mismatch detected',
      'expected', v_calculated_total,
      'received', p_total_amount
    );
  END IF;
  
  -- Validation 6: Rate limiting and fraud detection
  SELECT COUNT(*) INTO v_suspicious_count
  FROM bookings
  WHERE lower(trim(email)) = lower(trim(p_email))
    AND created_at > NOW() - INTERVAL '1 hour';
  
  IF v_suspicious_count >= 3 THEN
    -- Log security alert
    INSERT INTO security_alerts (alert_type, severity, details)
    VALUES (
      'rate_limit_exceeded',
      'high',
      json_build_object(
        'email', p_email,
        'attempt_count', v_suspicious_count + 1,
        'timeframe', '1 hour'
      )
    );
    
    RETURN json_build_object('success', false, 'error', 'Too many booking attempts. Please try again later.');
  END IF;
  
  -- Generate unique booking ID
  v_booking_id := 'BK' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
                  UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
  
  -- Insert the booking
  INSERT INTO bookings (
    booking_id,
    guest_name,
    email,
    whatsapp_number,
    check_in,
    check_out,
    guests,
    room_type,
    room_type_id,
    quantity,
    subtotal,
    taxes,
    total_amount,
    address,
    city,
    state,
    pincode,
    special_requests,
    emergency_contact,
    booking_status,
    payment_status,
    source
  ) VALUES (
    v_booking_id,
    TRIM(p_guest_name),
    lower(TRIM(p_email)),
    TRIM(p_whatsapp_number),
    p_check_in,
    p_check_out,
    p_guests,
    p_room_type,
    p_room_type_id,
    p_quantity,
    p_subtotal,
    p_taxes,
    p_total_amount,
    NULLIF(TRIM(p_address), ''),
    NULLIF(TRIM(p_city), ''),
    NULLIF(TRIM(p_state), ''),
    NULLIF(TRIM(p_pincode), ''),
    NULLIF(TRIM(p_special_requests), ''),
    NULLIF(TRIM(p_emergency_contact), ''),
    'pending',
    'pending',
    'web'
  ) RETURNING id INTO v_new_booking_id;
  
  -- Return success with booking ID
  RETURN json_build_object(
    'success', true,
    'bookingId', v_booking_id,
    'id', v_new_booking_id
  );
  
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error for debugging
    RAISE LOG 'Booking creation error: %', SQLERRM;
    RETURN json_build_object('success', false, 'error', 'Booking failed. Please try again.');
END;
$$;

-- Step 4: Grant execute permission to anonymous users
GRANT EXECUTE ON FUNCTION public.create_booking_secure TO anon;
GRANT EXECUTE ON FUNCTION public.create_booking_secure TO authenticated;

-- Step 5: Add comment for documentation
COMMENT ON FUNCTION public.create_booking_secure IS 
'Secure booking creation function with comprehensive validation, rate limiting, and fraud detection. 
This function replaces direct INSERT access to prevent booking data exposure and price manipulation.';