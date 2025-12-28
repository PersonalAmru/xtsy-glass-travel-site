-- PMS Database Schema Enhancement
-- Multi-property, iCal sync, invoicing, and dynamic pricing tables

-- 1. Properties table for multi-property/franchise support
CREATE TABLE IF NOT EXISTS public.properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  address text,
  city text,
  state text,
  country text DEFAULT 'India',
  timezone text DEFAULT 'Asia/Kolkata',
  currency text DEFAULT 'INR',
  contact_email text,
  contact_phone text,
  gst_number text,
  logo_url text,
  is_active boolean DEFAULT true,
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Admin can manage properties
CREATE POLICY "properties_admin_full_access" ON public.properties
  FOR ALL USING (get_user_role() IN ('admin', 'staff') OR auth.role() = 'service_role')
  WITH CHECK (get_user_role() IN ('admin', 'staff') OR auth.role() = 'service_role');

-- Public can read active properties
CREATE POLICY "properties_public_read" ON public.properties
  FOR SELECT USING (is_active = true);

-- Deny public modifications
CREATE POLICY "properties_deny_public_insert" ON public.properties
  FOR INSERT WITH CHECK (false);
CREATE POLICY "properties_deny_public_update" ON public.properties
  FOR UPDATE USING (false);
CREATE POLICY "properties_deny_public_delete" ON public.properties
  FOR DELETE USING (false);

-- 2. iCal Sync Configuration table
CREATE TABLE IF NOT EXISTS public.ical_sync_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE,
  room_type_id text NOT NULL,
  ota_name text NOT NULL, -- 'booking.com', 'airbnb', 'mmt', 'goibibo', etc
  ical_import_url text, -- URL to fetch calendar from OTA
  ical_export_token text DEFAULT gen_random_uuid()::text, -- Unique token for export URL
  sync_direction text DEFAULT 'both' CHECK (sync_direction IN ('import', 'export', 'both')),
  last_sync_at timestamptz,
  last_sync_status text,
  last_sync_error text,
  sync_frequency_minutes integer DEFAULT 60,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ical_sync_configs ENABLE ROW LEVEL SECURITY;

-- Admin only
CREATE POLICY "ical_sync_admin_full_access" ON public.ical_sync_configs
  FOR ALL USING (get_user_role() IN ('admin', 'staff') OR auth.role() = 'service_role')
  WITH CHECK (get_user_role() IN ('admin', 'staff') OR auth.role() = 'service_role');

-- Deny all public access
CREATE POLICY "ical_sync_deny_public" ON public.ical_sync_configs
  FOR ALL USING (false) WITH CHECK (false);

-- 3. iCal Sync Events log
CREATE TABLE IF NOT EXISTS public.ical_sync_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id uuid REFERENCES public.ical_sync_configs(id) ON DELETE CASCADE,
  event_type text NOT NULL, -- 'import', 'export', 'conflict'
  event_status text NOT NULL, -- 'success', 'error', 'warning'
  events_processed integer DEFAULT 0,
  events_created integer DEFAULT 0,
  events_updated integer DEFAULT 0,
  events_deleted integer DEFAULT 0,
  error_message text,
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ical_sync_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ical_events_admin_read" ON public.ical_sync_events
  FOR SELECT USING (get_user_role() IN ('admin', 'staff') OR auth.role() = 'service_role');

CREATE POLICY "ical_events_service_insert" ON public.ical_sync_events
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "ical_events_deny_public" ON public.ical_sync_events
  FOR ALL USING (false) WITH CHECK (false);

-- 4. Invoices table for GST-ready billing
CREATE TABLE IF NOT EXISTS public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE NOT NULL,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
  property_id uuid REFERENCES public.properties(id),
  guest_name text NOT NULL,
  guest_email text,
  guest_phone text,
  guest_address text,
  guest_gst_number text,
  invoice_date date DEFAULT CURRENT_DATE,
  due_date date,
  subtotal numeric(10,2) NOT NULL,
  cgst_rate numeric(5,2) DEFAULT 0,
  cgst_amount numeric(10,2) DEFAULT 0,
  sgst_rate numeric(5,2) DEFAULT 0,
  sgst_amount numeric(10,2) DEFAULT 0,
  igst_rate numeric(5,2) DEFAULT 0,
  igst_amount numeric(10,2) DEFAULT 0,
  total_amount numeric(10,2) NOT NULL,
  currency text DEFAULT 'INR',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  line_items jsonb DEFAULT '[]',
  notes text,
  payment_terms text,
  pdf_url text,
  sent_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "invoices_admin_full_access" ON public.invoices
  FOR ALL USING (get_user_role() IN ('admin', 'staff') OR auth.role() = 'service_role')
  WITH CHECK (get_user_role() IN ('admin', 'staff') OR auth.role() = 'service_role');

-- Deny public
CREATE POLICY "invoices_deny_public" ON public.invoices
  FOR ALL USING (false) WITH CHECK (false);

-- 5. Pricing Rules for dynamic/seasonal pricing
CREATE TABLE IF NOT EXISTS public.pricing_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE,
  room_type_id text,
  rule_name text NOT NULL,
  rule_type text NOT NULL CHECK (rule_type IN ('seasonal', 'day_of_week', 'last_minute', 'early_bird', 'occupancy', 'manual')),
  priority integer DEFAULT 0, -- Higher = applied later
  adjustment_type text NOT NULL CHECK (adjustment_type IN ('percentage', 'fixed')),
  adjustment_value numeric(10,2) NOT NULL, -- Positive = increase, negative = decrease
  start_date date,
  end_date date,
  days_of_week integer[] DEFAULT ARRAY[0,1,2,3,4,5,6], -- 0=Sun, 6=Sat
  min_nights integer,
  max_nights integer,
  min_days_advance integer,
  max_days_advance integer,
  min_occupancy_percent integer,
  max_occupancy_percent integer,
  is_active boolean DEFAULT true,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pricing_rules_admin_full_access" ON public.pricing_rules
  FOR ALL USING (get_user_role() IN ('admin', 'staff') OR auth.role() = 'service_role')
  WITH CHECK (get_user_role() IN ('admin', 'staff') OR auth.role() = 'service_role');

CREATE POLICY "pricing_rules_public_read" ON public.pricing_rules
  FOR SELECT USING (is_active = true);

CREATE POLICY "pricing_rules_deny_public_modify" ON public.pricing_rules
  FOR INSERT WITH CHECK (false);
CREATE POLICY "pricing_rules_deny_public_update" ON public.pricing_rules
  FOR UPDATE USING (false);
CREATE POLICY "pricing_rules_deny_public_delete" ON public.pricing_rules
  FOR DELETE USING (false);

-- 6. Add property_id to existing tables for multi-property support
ALTER TABLE public.room_types ADD COLUMN IF NOT EXISTS property_id uuid REFERENCES public.properties(id);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS property_id uuid REFERENCES public.properties(id);
ALTER TABLE public.blocked_dates ADD COLUMN IF NOT EXISTS property_id uuid REFERENCES public.properties(id);

-- 7. Add OTA source tracking to bookings
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS ota_booking_id text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS ota_name text;

-- 8. Create invoice number generator function
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  current_year text;
  current_month text;
  next_seq integer;
  invoice_num text;
BEGIN
  current_year := to_char(now(), 'YY');
  current_month := to_char(now(), 'MM');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 8 FOR 5) AS integer)), 0) + 1
  INTO next_seq
  FROM invoices
  WHERE invoice_number LIKE 'INV' || current_year || current_month || '%';
  
  invoice_num := 'INV' || current_year || current_month || LPAD(next_seq::text, 5, '0');
  RETURN invoice_num;
END;
$$;

-- 9. Update trigger for updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ical_sync_configs_updated_at
  BEFORE UPDATE ON public.ical_sync_configs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pricing_rules_updated_at
  BEFORE UPDATE ON public.pricing_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 10. Insert default property for existing data
INSERT INTO public.properties (name, slug, city, state, contact_email, gst_number)
VALUES ('XTSY Travellers Hostel', 'xtsy-shillong', 'Shillong', 'Meghalaya', 'hello@xtsy.in', NULL)
ON CONFLICT (slug) DO NOTHING;

-- 11. Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_property_id ON public.bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_ota_booking_id ON public.bookings(ota_booking_id);
CREATE INDEX IF NOT EXISTS idx_room_types_property_id ON public.room_types(property_id);
CREATE INDEX IF NOT EXISTS idx_ical_sync_room_type ON public.ical_sync_configs(room_type_id);
CREATE INDEX IF NOT EXISTS idx_invoices_booking_id ON public.invoices(booking_id);
CREATE INDEX IF NOT EXISTS idx_pricing_rules_room_type ON public.pricing_rules(room_type_id);