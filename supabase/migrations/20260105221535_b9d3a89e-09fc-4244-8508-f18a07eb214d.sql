-- Insert the existing invoice XTH-INV-001 as a booking so it appears in the calendar
INSERT INTO public.bookings (
  id,
  booking_id,
  guest_name,
  email,
  whatsapp_number,
  check_in,
  check_out,
  room_type,
  guests,
  quantity,
  subtotal,
  taxes,
  total_amount,
  booking_status,
  city,
  state,
  source
)
SELECT 
  gen_random_uuid(),
  bi.booking_id,
  bi.guest_name,
  bi.guest_email,
  bi.guest_phone,
  bi.check_in::date,
  bi.check_out::date,
  bi.room_name,
  bi.quantity,
  bi.quantity,
  bi.subtotal,
  bi.gst_amount,
  bi.total_amount,
  'confirmed',  -- Mark as confirmed so it shows on calendar
  bi.guest_city,
  bi.guest_state,
  'website'
FROM public.booking_invoices bi
WHERE bi.booking_id = 'XTH-INV-001'
AND NOT EXISTS (SELECT 1 FROM public.bookings WHERE bookings.booking_id = bi.booking_id);