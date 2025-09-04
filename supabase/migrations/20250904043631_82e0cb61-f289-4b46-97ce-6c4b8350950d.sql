-- Create the main bookings table with comprehensive booking information
CREATE TABLE public.bookings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id TEXT UNIQUE NOT NULL,
    guest_name TEXT NOT NULL,
    email TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    room_type TEXT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests INTEGER NOT NULL DEFAULT 1,
    subtotal INTEGER NOT NULL,
    taxes INTEGER NOT NULL DEFAULT 0,
    total_amount INTEGER NOT NULL,
    booking_status TEXT NOT NULL DEFAULT 'pending',
    payment_status TEXT DEFAULT 'pending',
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    emergency_contact TEXT,
    special_requests TEXT,
    source TEXT DEFAULT 'direct',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE
);

-- Add constraints and validations
ALTER TABLE public.bookings ADD CONSTRAINT bookings_email_check 
    CHECK (email ~* '^[A-Za-z0-9]([A-Za-z0-9._%-]*[A-Za-z0-9])?@[A-Za-z0-9]([A-Za-z0-9.-]*[A-Za-z0-9])?\\.[A-Za-z]{2,}$');

ALTER TABLE public.bookings ADD CONSTRAINT bookings_guests_check 
    CHECK (guests >= 1 AND guests <= 20);

ALTER TABLE public.bookings ADD CONSTRAINT bookings_amount_check 
    CHECK (total_amount > 0 AND subtotal > 0);

ALTER TABLE public.bookings ADD CONSTRAINT bookings_dates_check 
    CHECK (check_out > check_in);

-- Create indexes for better performance
CREATE INDEX idx_bookings_email ON public.bookings(email);
CREATE INDEX idx_bookings_booking_id ON public.bookings(booking_id);
CREATE INDEX idx_bookings_status ON public.bookings(booking_status);
CREATE INDEX idx_bookings_dates ON public.bookings(check_in, check_out);
CREATE INDEX idx_bookings_created_at ON public.bookings(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Admins and staff can view all bookings" 
ON public.bookings FOR SELECT 
USING (is_admin_or_staff());

CREATE POLICY "Service role can manage all bookings" 
ON public.bookings FOR ALL 
USING (auth.role() = 'service_role');

CREATE POLICY "Guests can only view their own bookings" 
ON public.bookings FOR SELECT 
USING (auth.jwt() ->> 'email' = email);

-- Create trigger to auto-generate booking_id
CREATE TRIGGER set_booking_id_trigger
BEFORE INSERT ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.set_booking_id();

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create validation trigger
CREATE TRIGGER validate_booking_data_trigger
BEFORE INSERT OR UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.sanitize_and_validate_booking_data();