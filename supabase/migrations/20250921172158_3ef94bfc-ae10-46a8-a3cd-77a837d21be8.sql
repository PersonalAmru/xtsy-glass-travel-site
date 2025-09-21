-- Drop the strict email check constraint that's blocking valid emails
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_email_check;

-- Also ensure we have proper indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_email_created ON public.bookings(email, created_at);
CREATE INDEX IF NOT EXISTS idx_bookings_room_type_dates ON public.bookings(room_type_id, check_in, check_out);