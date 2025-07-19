
-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('guest', 'staff', 'admin', 'channel_manager', 'housekeeping', 'front_desk');

-- Create profiles table for authenticated users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role user_role DEFAULT 'guest',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table for multiple role assignments
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create room_types table for inventory management
CREATE TABLE public.room_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  capacity INTEGER NOT NULL,
  base_price INTEGER NOT NULL, -- in paise
  amenities JSONB DEFAULT '[]',
  images JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inventory table for real-time availability
CREATE TABLE public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_type_id UUID REFERENCES room_types(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_units INTEGER NOT NULL DEFAULT 0,
  available_units INTEGER NOT NULL DEFAULT 0,
  rate INTEGER NOT NULL, -- in paise, dynamic pricing
  min_rate INTEGER, -- minimum rate threshold
  max_rate INTEGER, -- maximum rate threshold
  stop_sale BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(room_type_id, date)
);

-- Create OTA integrations table
CREATE TABLE public.ota_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ota_name TEXT NOT NULL, -- booking.com, expedia, etc.
  api_key TEXT,
  api_secret TEXT,
  endpoint_url TEXT,
  is_active BOOLEAN DEFAULT false,
  sync_rates BOOLEAN DEFAULT true,
  sync_inventory BOOLEAN DEFAULT true,
  commission_rate DECIMAL(5,2), -- percentage
  mapping_config JSONB DEFAULT '{}', -- room type mappings
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create booking_channels table to track booking sources
CREATE TABLE public.booking_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'direct', 'ota', 'phone', 'walkin'
  commission_rate DECIMAL(5,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit_logs table for tracking all changes
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID,
  action TEXT NOT NULL, -- INSERT, UPDATE, DELETE
  old_values JSONB,
  new_values JSONB,
  user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create webhook_events table for OTA webhooks
CREATE TABLE public.webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL, -- booking.com, expedia, etc.
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  processing_attempts INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ota_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = _user_id AND role = _role
  ) OR EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = _user_id AND role = _role
  );
$$;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'guest')
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to update inventory on booking
CREATE OR REPLACE FUNCTION public.update_inventory_on_booking()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
AS $$
DECLARE
  room_item JSONB;
  booking_date DATE;
  nights_count INTEGER;
BEGIN
  -- Extract nights from booking
  nights_count := NEW.nights;
  booking_date := NEW.check_in;
  
  -- Update inventory for each room type in the booking
  FOR room_item IN SELECT * FROM jsonb_array_elements(NEW.room_details)
  LOOP
    -- Update availability for each night
    FOR i IN 0..nights_count-1 LOOP
      UPDATE public.inventory 
      SET available_units = available_units - (room_item->>'quantity')::INTEGER
      WHERE room_type_id = (room_item->>'room_type_id')::UUID
      AND date = booking_date + INTERVAL '1 day' * i;
    END LOOP;
  END LOOP;
  
  RETURN NEW;
END;
$$;

-- Create trigger to update inventory on confirmed bookings
CREATE TRIGGER update_inventory_after_booking
  AFTER UPDATE OF booking_status ON public.bookings
  FOR EACH ROW
  WHEN (NEW.booking_status = 'confirmed' AND OLD.booking_status != 'confirmed')
  EXECUTE PROCEDURE public.update_inventory_on_booking();

-- RLS Policies

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Staff can view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

-- Room types policies (public read, staff manage)
CREATE POLICY "Anyone can view room types" ON public.room_types
  FOR SELECT USING (is_active = true);

CREATE POLICY "Staff can manage room types" ON public.room_types
  FOR ALL USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

-- Inventory policies
CREATE POLICY "Anyone can view available inventory" ON public.inventory
  FOR SELECT USING (NOT stop_sale);

CREATE POLICY "Staff can manage inventory" ON public.inventory
  FOR ALL USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

-- OTA integrations policies (admin only)
CREATE POLICY "Admin can manage OTA integrations" ON public.ota_integrations
  FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'channel_manager'));

-- Audit logs policies
CREATE POLICY "Staff can view audit logs" ON public.audit_logs
  FOR SELECT USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

-- Webhook events policies
CREATE POLICY "System can manage webhook events" ON public.webhook_events
  FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'channel_manager'));

-- Insert default room types
INSERT INTO public.room_types (name, description, capacity, base_price, amenities) VALUES
('4-Bed Mixed Dorm', 'Shared dormitory with 4 beds, mixed gender', 4, 80000, '["Free WiFi", "Locker", "AC", "Reading Light"]'),
('6-Bed Mixed Dorm', 'Shared dormitory with 6 beds, mixed gender', 6, 70000, '["Free WiFi", "Locker", "AC", "Reading Light"]'),
('4-Bed Female Dorm', 'Female-only dormitory with 4 beds', 4, 80000, '["Free WiFi", "Locker", "AC", "Reading Light", "Female Only"]'),
('Private Room', 'Private room with ensuite bathroom', 2, 200000, '["Free WiFi", "AC", "Private Bathroom", "TV", "Mini Fridge"]');

-- Insert default booking channels
INSERT INTO public.booking_channels (name, type, commission_rate) VALUES
('Direct Website', 'direct', 0),
('Booking.com', 'ota', 15.00),
('Hostelworld', 'ota', 12.00),
('Expedia', 'ota', 18.00),
('MakeMyTrip', 'ota', 20.00),
('Phone Booking', 'phone', 0),
('Walk-in', 'walkin', 0);

-- Create indexes for performance
CREATE INDEX idx_inventory_room_date ON public.inventory(room_type_id, date);
CREATE INDEX idx_bookings_status ON public.bookings(booking_status);
CREATE INDEX idx_bookings_dates ON public.bookings(check_in, check_out);
CREATE INDEX idx_audit_logs_table_record ON public.audit_logs(table_name, record_id);
CREATE INDEX idx_webhook_events_processed ON public.webhook_events(processed, created_at);
