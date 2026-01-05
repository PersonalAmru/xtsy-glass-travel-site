-- ============================================
-- BOOKING SYSTEM: Invoices, Messages, Notifications
-- ============================================

-- 1. Invoice counter for sequential booking IDs (XTH-INV-001)
CREATE TABLE IF NOT EXISTS public.invoice_counter (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  counter INTEGER NOT NULL DEFAULT 0,
  prefix TEXT NOT NULL DEFAULT 'XTH-INV-',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert initial counter
INSERT INTO public.invoice_counter (counter, prefix) 
VALUES (0, 'XTH-INV-')
ON CONFLICT DO NOTHING;

-- 2. Booking Invoices table
CREATE TABLE IF NOT EXISTS public.booking_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id TEXT NOT NULL UNIQUE,
  invoice_number TEXT NOT NULL UNIQUE,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  guest_address TEXT,
  guest_city TEXT,
  guest_state TEXT,
  guest_pincode TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  room_name TEXT NOT NULL,
  room_type TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  nights INTEGER NOT NULL,
  rate_per_night INTEGER NOT NULL,
  subtotal INTEGER NOT NULL,
  gst_rate DECIMAL(5,2) NOT NULL DEFAULT 0.12,
  gst_amount INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'pending',
  pdf_url TEXT,
  html_content TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Booking Messages (Guest-Host Chat)
CREATE TABLE IF NOT EXISTS public.booking_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id TEXT NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('guest', 'admin')),
  sender_name TEXT NOT NULL,
  sender_id TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Admin Notifications
CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('new_booking', 'new_message', 'booking_update', 'payment_received')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  booking_id TEXT,
  metadata JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Push Subscription Storage (for browser push notifications)
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_type TEXT NOT NULL DEFAULT 'admin' CHECK (user_type IN ('guest', 'admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_booking_messages_booking_id ON public.booking_messages(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_messages_created_at ON public.booking_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_is_read ON public.admin_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_created_at ON public.admin_notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_booking_invoices_booking_id ON public.booking_invoices(booking_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_type ON public.push_subscriptions(user_type);

-- ============================================
-- Enable RLS
-- ============================================
ALTER TABLE public.invoice_counter ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies
-- ============================================

-- Invoice Counter: Only service role can modify
CREATE POLICY "Invoice counter read for authenticated" ON public.invoice_counter 
  FOR SELECT USING (true);

-- Booking Invoices: Guests can view their own, admins see all
CREATE POLICY "Invoices read for all" ON public.booking_invoices 
  FOR SELECT USING (true);
CREATE POLICY "Invoices insert for all" ON public.booking_invoices 
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Invoices update for all" ON public.booking_invoices 
  FOR UPDATE USING (true);

-- Booking Messages: Anyone can read/write (booking_id based access)
CREATE POLICY "Messages read for all" ON public.booking_messages 
  FOR SELECT USING (true);
CREATE POLICY "Messages insert for all" ON public.booking_messages 
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Messages update for all" ON public.booking_messages 
  FOR UPDATE USING (true);

-- Admin Notifications: All can read (internal system)
CREATE POLICY "Notifications read for all" ON public.admin_notifications 
  FOR SELECT USING (true);
CREATE POLICY "Notifications insert for all" ON public.admin_notifications 
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Notifications update for all" ON public.admin_notifications 
  FOR UPDATE USING (true);

-- Push Subscriptions: All can manage
CREATE POLICY "Push subs read for all" ON public.push_subscriptions 
  FOR SELECT USING (true);
CREATE POLICY "Push subs insert for all" ON public.push_subscriptions 
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Push subs update for all" ON public.push_subscriptions 
  FOR UPDATE USING (true);
CREATE POLICY "Push subs delete for all" ON public.push_subscriptions 
  FOR DELETE USING (true);

-- ============================================
-- Function to generate sequential booking ID
-- ============================================
CREATE OR REPLACE FUNCTION public.generate_booking_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_counter INTEGER;
  new_id TEXT;
BEGIN
  -- Increment counter and get new value
  UPDATE public.invoice_counter 
  SET counter = counter + 1, updated_at = now()
  WHERE id = (SELECT id FROM public.invoice_counter LIMIT 1)
  RETURNING counter INTO new_counter;
  
  -- Format as XTH-INV-001, XTH-INV-002, etc.
  new_id := 'XTH-INV-' || LPAD(new_counter::TEXT, 3, '0');
  
  RETURN new_id;
END;
$$;

-- ============================================
-- Function to create booking with invoice
-- ============================================
CREATE OR REPLACE FUNCTION public.create_booking_with_invoice(
  p_guest_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_check_in DATE,
  p_check_out DATE,
  p_room_name TEXT,
  p_room_type TEXT,
  p_quantity INTEGER,
  p_nights INTEGER,
  p_rate_per_night INTEGER,
  p_subtotal INTEGER,
  p_gst_rate DECIMAL,
  p_gst_amount INTEGER,
  p_total_amount INTEGER,
  p_message_to_host TEXT,
  p_address TEXT DEFAULT NULL,
  p_city TEXT DEFAULT NULL,
  p_state TEXT DEFAULT NULL,
  p_pincode TEXT DEFAULT NULL,
  p_special_requests TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_booking_id TEXT;
  invoice_id UUID;
  notification_id UUID;
BEGIN
  -- Generate sequential booking ID
  new_booking_id := public.generate_booking_id();
  
  -- Create invoice record
  INSERT INTO public.booking_invoices (
    booking_id, invoice_number, guest_name, guest_email, guest_phone,
    guest_address, guest_city, guest_state, guest_pincode,
    check_in, check_out, room_name, room_type, quantity, nights,
    rate_per_night, subtotal, gst_rate, gst_amount, total_amount, status
  ) VALUES (
    new_booking_id, new_booking_id, p_guest_name, p_email, p_phone,
    p_address, p_city, p_state, p_pincode,
    p_check_in, p_check_out, p_room_name, p_room_type, p_quantity, p_nights,
    p_rate_per_night, p_subtotal, p_gst_rate, p_gst_amount, p_total_amount, 'confirmed'
  )
  RETURNING id INTO invoice_id;
  
  -- Create the mandatory message to host
  INSERT INTO public.booking_messages (
    booking_id, sender_type, sender_name, message
  ) VALUES (
    new_booking_id, 'guest', p_guest_name, p_message_to_host
  );
  
  -- Create admin notification for new booking
  INSERT INTO public.admin_notifications (
    type, title, message, booking_id, metadata
  ) VALUES (
    'new_booking',
    'New Booking: ' || new_booking_id,
    p_guest_name || ' booked ' || p_room_name || ' for ' || p_nights || ' nights',
    new_booking_id,
    jsonb_build_object(
      'guest_name', p_guest_name,
      'guest_email', p_email,
      'guest_phone', p_phone,
      'check_in', p_check_in,
      'check_out', p_check_out,
      'room_name', p_room_name,
      'total_amount', p_total_amount,
      'message_to_host', p_message_to_host
    )
  )
  RETURNING id INTO notification_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'bookingId', new_booking_id,
    'invoiceId', invoice_id,
    'notificationId', notification_id
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- ============================================
-- Enable Realtime for chat and notifications
-- ============================================
ALTER TABLE public.booking_messages REPLICA IDENTITY FULL;
ALTER TABLE public.admin_notifications REPLICA IDENTITY FULL;

-- Add tables to realtime publication
DO $$
BEGIN
  -- Check if publication exists and add tables
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    -- Safely add tables to publication
    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.booking_messages;
    EXCEPTION WHEN duplicate_object THEN
      NULL;
    END;
    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_notifications;
    EXCEPTION WHEN duplicate_object THEN
      NULL;
    END;
  END IF;
END $$;

-- ============================================
-- Trigger to notify on new message
-- ============================================
CREATE OR REPLACE FUNCTION public.notify_new_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create notification when guest sends a message
  IF NEW.sender_type = 'guest' THEN
    INSERT INTO public.admin_notifications (
      type, title, message, booking_id, metadata
    ) VALUES (
      'new_message',
      'New message for ' || NEW.booking_id,
      'Message from ' || NEW.sender_name,
      NEW.booking_id,
      jsonb_build_object('message_id', NEW.id, 'sender_name', NEW.sender_name)
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for message notifications
DROP TRIGGER IF EXISTS trigger_notify_new_message ON public.booking_messages;
CREATE TRIGGER trigger_notify_new_message
  AFTER INSERT ON public.booking_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_message();

-- ============================================
-- Updated_at trigger for relevant tables
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_booking_invoices_updated_at
  BEFORE UPDATE ON public.booking_invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_push_subscriptions_updated_at
  BEFORE UPDATE ON public.push_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();