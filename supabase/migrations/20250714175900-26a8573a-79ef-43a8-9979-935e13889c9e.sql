
-- Create bookings table to store booking information
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id TEXT UNIQUE NOT NULL,
  guest_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  emergency_contact TEXT,
  emergency_relation TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  nights INTEGER NOT NULL,
  guests INTEGER NOT NULL,
  room_details JSONB NOT NULL,
  subtotal INTEGER NOT NULL, -- amount in paise
  gst_amount INTEGER NOT NULL,
  discount_amount INTEGER DEFAULT 0,
  total_amount INTEGER NOT NULL,
  promo_code TEXT,
  promo_applied BOOLEAN DEFAULT false,
  booking_status TEXT DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'failed', 'cancelled')),
  payment_method TEXT DEFAULT 'razorpay',
  payment_verified_at TIMESTAMPTZ,
  invoice_generated BOOLEAN DEFAULT false,
  invoice_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create transactions table for payment tracking
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  txn_id TEXT UNIQUE NOT NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  razorpay_payment_id TEXT,
  amount INTEGER NOT NULL, -- amount in paise
  currency TEXT DEFAULT 'INR',
  source TEXT CHECK (source IN ('razorpay', 'sms', 'email', 'webhook')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'success', 'failed')),
  matched BOOLEAN DEFAULT false,
  gateway_response JSONB,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create booking confirmations table for tracking sent confirmations
CREATE TABLE public.booking_confirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  sent_to_guest_whatsapp BOOLEAN DEFAULT false,
  sent_to_guest_email BOOLEAN DEFAULT false,
  sent_to_property_whatsapp BOOLEAN DEFAULT false,
  sent_to_property_email BOOLEAN DEFAULT false,
  confirmation_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_confirmations ENABLE ROW LEVEL SECURITY;

-- Create policies for bookings table
CREATE POLICY "Anyone can insert bookings" ON public.bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view bookings" ON public.bookings
  FOR SELECT USING (true);

CREATE POLICY "Anyone can update bookings" ON public.bookings
  FOR UPDATE USING (true);

-- Create policies for transactions table
CREATE POLICY "Anyone can insert transactions" ON public.transactions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view transactions" ON public.transactions
  FOR SELECT USING (true);

CREATE POLICY "Anyone can update transactions" ON public.transactions
  FOR UPDATE USING (true);

-- Create policies for booking confirmations table
CREATE POLICY "Anyone can insert confirmations" ON public.booking_confirmations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view confirmations" ON public.booking_confirmations
  FOR SELECT USING (true);

CREATE POLICY "Anyone can update confirmations" ON public.booking_confirmations
  FOR UPDATE USING (true);

-- Create indexes for better performance
CREATE INDEX idx_bookings_booking_id ON public.bookings(booking_id);
CREATE INDEX idx_bookings_status ON public.bookings(booking_status);
CREATE INDEX idx_bookings_created_at ON public.bookings(created_at);
CREATE INDEX idx_transactions_txn_id ON public.transactions(txn_id);
CREATE INDEX idx_transactions_booking_id ON public.transactions(booking_id);
CREATE INDEX idx_transactions_payment_status ON public.transactions(payment_status);

-- Create storage bucket for booking invoices
INSERT INTO storage.buckets (id, name, public) 
VALUES ('booking-invoices', 'booking-invoices', false);

-- Create storage policy for booking invoices
CREATE POLICY "Anyone can upload booking invoices" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'booking-invoices');

CREATE POLICY "Anyone can view booking invoices" ON storage.objects
  FOR SELECT USING (bucket_id = 'booking-invoices');

-- Function to generate unique booking ID
CREATE OR REPLACE FUNCTION generate_booking_id()
RETURNS TEXT AS $$
DECLARE
  new_id TEXT;
  exists_check INTEGER;
BEGIN
  LOOP
    -- Generate booking ID in format: XTSY-YYYYMMDD-XXXX
    new_id := 'XTSY-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    
    -- Check if this ID already exists
    SELECT COUNT(*) INTO exists_check FROM public.bookings WHERE booking_id = new_id;
    
    -- If it doesn't exist, use it
    IF exists_check = 0 THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate booking ID
CREATE OR REPLACE FUNCTION set_booking_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.booking_id IS NULL OR NEW.booking_id = '' THEN
    NEW.booking_id := generate_booking_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_booking_id
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_booking_id();
