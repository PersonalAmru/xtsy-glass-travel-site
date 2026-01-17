-- Step 1: Clear all existing booking-related data and reset counters
-- Delete existing invoices first (due to foreign key constraints)
DELETE FROM public.booking_invoices;
DELETE FROM public.booking_messages;
DELETE FROM public.admin_notifications WHERE type = 'booking';
DELETE FROM public.booking_settlement_history;
DELETE FROM public.bookings;

-- Reset existing invoice counter and add enquiry counter
TRUNCATE public.invoice_counter;

-- Insert fresh counters
INSERT INTO public.invoice_counter (prefix, counter) VALUES 
  ('XTH-ENQ-', 0),
  ('XTH-INV-', 0);

-- Step 2: Create enquiries table for tracking traffic/leads
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id TEXT NOT NULL UNIQUE,
  guest_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  room_type TEXT NOT NULL,
  room_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  nights INTEGER NOT NULL,
  rate_per_night NUMERIC NOT NULL,
  subtotal NUMERIC NOT NULL,
  gst_rate NUMERIC NOT NULL DEFAULT 0.12,
  gst_amount NUMERIC NOT NULL,
  total_amount NUMERIC NOT NULL,
  guest_address TEXT,
  guest_city TEXT,
  guest_state TEXT,
  guest_pincode TEXT,
  special_requests TEXT,
  user_id UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  approved_at TIMESTAMPTZ,
  approved_by UUID,
  rejected_at TIMESTAMPTZ,
  rejected_by UUID,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for enquiries
CREATE POLICY "Admins can view all enquiries"
  ON public.enquiries FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert enquiries"
  ON public.enquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update enquiries"
  ON public.enquiries FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own enquiries"
  ON public.enquiries FOR SELECT
  USING (user_id = auth.uid());

-- Function to create enquiry with sequential ID
CREATE OR REPLACE FUNCTION public.create_enquiry(
  p_guest_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_check_in TEXT,
  p_check_out TEXT,
  p_room_type TEXT,
  p_room_name TEXT,
  p_quantity INTEGER,
  p_nights INTEGER,
  p_rate_per_night NUMERIC,
  p_subtotal NUMERIC,
  p_gst_rate NUMERIC,
  p_gst_amount NUMERIC,
  p_total_amount NUMERIC,
  p_address TEXT DEFAULT NULL,
  p_city TEXT DEFAULT NULL,
  p_state TEXT DEFAULT NULL,
  p_pincode TEXT DEFAULT NULL,
  p_special_requests TEXT DEFAULT NULL,
  p_user_id UUID DEFAULT NULL
)
RETURNS TABLE(enquiry_id TEXT, enquiry_uuid UUID)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_counter INTEGER;
  v_enquiry_id TEXT;
  v_enquiry_uuid UUID;
BEGIN
  -- Get next counter
  UPDATE invoice_counter 
  SET counter = counter + 1, updated_at = now()
  WHERE prefix = 'XTH-ENQ-'
  RETURNING counter INTO v_counter;
  
  IF v_counter IS NULL THEN
    INSERT INTO invoice_counter (prefix, counter) VALUES ('XTH-ENQ-', 1)
    RETURNING counter INTO v_counter;
  END IF;
  
  v_enquiry_id := 'XTH-ENQ-' || LPAD(v_counter::text, 3, '0');
  v_enquiry_uuid := gen_random_uuid();
  
  -- Insert enquiry
  INSERT INTO enquiries (
    id, enquiry_id, guest_name, email, phone,
    check_in, check_out, room_type, room_name,
    quantity, nights, rate_per_night, subtotal,
    gst_rate, gst_amount, total_amount,
    guest_address, guest_city, guest_state, guest_pincode,
    special_requests, user_id
  ) VALUES (
    v_enquiry_uuid, v_enquiry_id, p_guest_name, p_email, p_phone,
    p_check_in::DATE, p_check_out::DATE, p_room_type, p_room_name,
    p_quantity, p_nights, p_rate_per_night, p_subtotal,
    p_gst_rate, p_gst_amount, p_total_amount,
    p_address, p_city, p_state, p_pincode,
    p_special_requests, p_user_id
  );
  
  -- Create admin notification for new enquiry
  INSERT INTO admin_notifications (type, title, message, metadata)
  VALUES (
    'enquiry',
    'New Booking Enquiry',
    'New enquiry ' || v_enquiry_id || ' from ' || p_guest_name,
    jsonb_build_object(
      'enquiry_id', v_enquiry_id,
      'guest_name', p_guest_name,
      'check_in', p_check_in,
      'check_out', p_check_out,
      'total_amount', p_total_amount
    )
  );
  
  RETURN QUERY SELECT v_enquiry_id, v_enquiry_uuid;
END;
$$;

-- Function to approve enquiry and create booking with invoice
CREATE OR REPLACE FUNCTION public.approve_enquiry(
  p_enquiry_uuid UUID,
  p_admin_id UUID
)
RETURNS TABLE(booking_id TEXT, invoice_number TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_enquiry RECORD;
  v_counter INTEGER;
  v_booking_id TEXT;
  v_booking_uuid UUID;
BEGIN
  -- Get enquiry details
  SELECT * INTO v_enquiry FROM enquiries WHERE id = p_enquiry_uuid AND status = 'pending';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Enquiry not found or not pending';
  END IF;
  
  -- Get next invoice counter
  UPDATE invoice_counter 
  SET counter = counter + 1, updated_at = now()
  WHERE prefix = 'XTH-INV-'
  RETURNING counter INTO v_counter;
  
  IF v_counter IS NULL THEN
    INSERT INTO invoice_counter (prefix, counter) VALUES ('XTH-INV-', 1)
    RETURNING counter INTO v_counter;
  END IF;
  
  v_booking_id := 'XTH-INV-' || LPAD(v_counter::text, 3, '0');
  v_booking_uuid := gen_random_uuid();
  
  -- Create booking
  INSERT INTO bookings (
    id, booking_id, guest_name, email, whatsapp_number,
    check_in, check_out, room_type, quantity, guests,
    subtotal, taxes, total_amount,
    address, city, state, pincode, special_requests,
    user_id, booking_status, payment_status,
    settlement_status, approved_at, approved_by, source
  ) VALUES (
    v_booking_uuid, v_booking_id, v_enquiry.guest_name, v_enquiry.email, v_enquiry.phone,
    v_enquiry.check_in::TEXT, v_enquiry.check_out::TEXT, v_enquiry.room_type, v_enquiry.quantity, v_enquiry.quantity,
    v_enquiry.subtotal, v_enquiry.gst_amount, v_enquiry.total_amount,
    v_enquiry.guest_address, v_enquiry.guest_city, v_enquiry.guest_state, v_enquiry.guest_pincode, v_enquiry.special_requests,
    v_enquiry.user_id, 'confirmed', 'pending',
    'initiated', now(), p_admin_id, 'direct'
  );
  
  -- Create invoice
  INSERT INTO booking_invoices (
    booking_id, invoice_number, guest_name, guest_email, guest_phone,
    check_in, check_out, room_type, room_name,
    quantity, nights, rate_per_night, subtotal,
    gst_rate, gst_amount, total_amount,
    guest_address, guest_city, guest_state, guest_pincode, status
  ) VALUES (
    v_booking_id, v_booking_id, v_enquiry.guest_name, v_enquiry.email, v_enquiry.phone,
    v_enquiry.check_in::TEXT, v_enquiry.check_out::TEXT, v_enquiry.room_type, v_enquiry.room_name,
    v_enquiry.quantity, v_enquiry.nights, v_enquiry.rate_per_night, v_enquiry.subtotal,
    v_enquiry.gst_rate, v_enquiry.gst_amount, v_enquiry.total_amount,
    v_enquiry.guest_address, v_enquiry.guest_city, v_enquiry.guest_state, v_enquiry.guest_pincode, 'confirmed'
  );
  
  -- Update enquiry status
  UPDATE enquiries 
  SET status = 'approved', approved_at = now(), approved_by = p_admin_id, updated_at = now()
  WHERE id = p_enquiry_uuid;
  
  -- Admin notification
  INSERT INTO admin_notifications (type, title, message, booking_id, metadata)
  VALUES (
    'booking',
    'Booking Confirmed',
    'Invoice ' || v_booking_id || ' created for ' || v_enquiry.guest_name,
    v_booking_uuid::TEXT,
    jsonb_build_object(
      'booking_id', v_booking_id,
      'enquiry_id', v_enquiry.enquiry_id,
      'total_amount', v_enquiry.total_amount
    )
  );
  
  RETURN QUERY SELECT v_booking_id, v_booking_id;
END;
$$;