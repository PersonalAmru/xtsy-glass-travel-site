-- Drop and recreate with correct types
DROP FUNCTION IF EXISTS public.get_booking_calendar(date, date);

CREATE FUNCTION public.get_booking_calendar(
  p_start_date date,
  p_end_date date
)
RETURNS TABLE (
  id uuid,
  booking_id text,
  guest_name text,
  email text,
  room_type text,
  check_in date,
  check_out date,
  booking_status text,
  approved_at timestamptz,
  no_show_marked_at timestamptz,
  quantity integer,
  total_amount integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.booking_id,
    b.guest_name,
    b.email,
    b.room_type,
    b.check_in,
    b.check_out,
    b.booking_status,
    b.approved_at,
    b.no_show_marked_at,
    b.quantity,
    b.total_amount::integer
  FROM public.bookings b
  WHERE 
    b.check_in <= p_end_date 
    AND b.check_out >= p_start_date
    AND b.booking_status IN ('pending', 'confirmed', 'cancelled', 'no_show', 'completed')
  ORDER BY b.check_in, b.guest_name;
END;
$$;