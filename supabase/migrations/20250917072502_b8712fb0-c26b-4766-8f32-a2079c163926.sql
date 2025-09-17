-- Real-time Room Inventory System Migration (Fixed)
-- This creates atomic inventory control with no race conditions

-- Create room_types table (master data)
CREATE TABLE IF NOT EXISTS public.room_types (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'private', 'dorm'
  kind TEXT NOT NULL, -- 'luxury', 'standard', 'economy'
  capacity INTEGER NOT NULL, -- max guests per unit
  total_units INTEGER NOT NULL, -- total available units
  base_price INTEGER NOT NULL DEFAULT 0, -- base price per night
  amenities TEXT[] DEFAULT '{}', -- room amenities
  images TEXT[] DEFAULT '{}', -- room images
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create room_inventory table (nightly availability tracking)
CREATE TABLE IF NOT EXISTS public.room_inventory (
  room_type_id TEXT NOT NULL REFERENCES public.room_types(id),
  date DATE NOT NULL,
  available_count INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (room_type_id, date),
  CONSTRAINT available_count_non_negative CHECK (available_count >= 0)
);

-- Create pending_orders table for payment flow
CREATE TABLE IF NOT EXISTS public.pending_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT UNIQUE NOT NULL,
  room_type_id TEXT NOT NULL REFERENCES public.room_types(id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  amount INTEGER NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '30 minutes'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add missing columns to existing bookings table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='room_type_id') THEN
    ALTER TABLE public.bookings ADD COLUMN room_type_id TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='quantity') THEN
    ALTER TABLE public.bookings ADD COLUMN quantity INTEGER DEFAULT 1;
  END IF;
END $$;

-- Update existing bookings to map room_type to room_type_id
UPDATE public.bookings 
SET room_type_id = CASE 
  WHEN room_type = 'XTSY 270 Premium' THEN 'xtsy-270'
  WHEN room_type = '4 Bed Female Only Dorm' THEN '4-bed-female-only-dorm'
  WHEN room_type = '4 Bed Mixed Dorm (Female Friendly)' THEN '4-bed-mixed-female-dorm'
  WHEN room_type = '6 Bed Mixed Dorm (Female Friendly)' THEN '6-bed-mixed-female-dorm'
  WHEN room_type = '6 Bed Mixed Dorm' THEN '6-bed-mixed-dorm'
  WHEN room_type = 'King Double Room (Private)' THEN 'king-double-room'
  WHEN room_type = 'King Triple Room (Private)' THEN 'king-triple-room'
  WHEN room_type = '6 Bed Mixed Economy Dorm' THEN '6-bed-mixed-economy-dorm'
  WHEN room_type = '8 Bed Mixed Economy Dorm' THEN '8-bed-mixed-economy-dorm'
  ELSE 'xtsy-270'
END
WHERE room_type_id IS NULL;

-- Seed room types data
INSERT INTO public.room_types (id, name, category, kind, capacity, total_units, base_price) VALUES
('xtsy-270', 'XTSY 270 Premium', 'private', 'luxury', 2, 1, 4500),
('4-bed-female-only-dorm', '4 Bed Female Only Dorm', 'dorm', 'standard', 1, 4, 800),
('4-bed-mixed-female-dorm', '4 Bed Mixed Dorm (Female Friendly)', 'dorm', 'standard', 1, 4, 750),
('6-bed-mixed-female-dorm', '6 Bed Mixed Dorm (Female Friendly)', 'dorm', 'standard', 1, 6, 700),
('6-bed-mixed-dorm', '6 Bed Mixed Dorm', 'dorm', 'standard', 1, 24, 650),
('king-double-room', 'King Double Room (Private)', 'private', 'standard', 2, 2, 2500),
('king-triple-room', 'King Triple Room (Private)', 'private', 'standard', 3, 1, 3200),
('6-bed-mixed-economy-dorm', '6 Bed Mixed Economy Dorm', 'dorm', 'economy', 1, 6, 500),
('8-bed-mixed-economy-dorm', '8 Bed Mixed Economy Dorm', 'dorm', 'economy', 1, 8, 450)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  kind = EXCLUDED.kind,
  capacity = EXCLUDED.capacity,
  total_units = EXCLUDED.total_units,
  base_price = EXCLUDED.base_price,
  updated_at = now();

-- Function to check room availability for RLS
CREATE OR REPLACE FUNCTION public.is_room_available(
  p_room_type_id TEXT,
  p_check_in DATE,
  p_check_out DATE,
  p_quantity INTEGER DEFAULT 1
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  check_date DATE;
  available_units INTEGER;
  total_units INTEGER;
BEGIN
  -- Get total units for this room type
  SELECT rt.total_units INTO total_units
  FROM public.room_types rt
  WHERE rt.id = p_room_type_id AND rt.is_active = true;
  
  IF total_units IS NULL THEN
    RETURN false;
  END IF;

  -- Check availability for each night
  check_date := p_check_in;
  WHILE check_date < p_check_out LOOP
    -- Get available count for this date
    SELECT COALESCE(ri.available_count, total_units) INTO available_units
    FROM public.room_inventory ri
    WHERE ri.room_type_id = p_room_type_id AND ri.date = check_date;
    
    -- If any night doesn't have enough availability, return false
    IF available_units < p_quantity THEN
      RETURN false;
    END IF;
    
    check_date := check_date + INTERVAL '1 day';
  END LOOP;
  
  RETURN true;
END;
$$;

-- Function to handle inventory updates on booking insert
CREATE OR REPLACE FUNCTION public.handle_booking_inventory_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  check_date DATE;
  total_units INTEGER;
  current_available INTEGER;
BEGIN
  -- Skip if no room_type_id (for backward compatibility)
  IF NEW.room_type_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Get total units for this room type
  SELECT rt.total_units INTO total_units
  FROM public.room_types rt
  WHERE rt.id = NEW.room_type_id AND rt.is_active = true;
  
  IF total_units IS NULL THEN
    RAISE EXCEPTION 'Invalid room type: %', NEW.room_type_id;
  END IF;

  -- Process each night in the booking period
  check_date := NEW.check_in;
  WHILE check_date < NEW.check_out LOOP
    -- Upsert inventory record and decrement availability
    INSERT INTO public.room_inventory (room_type_id, date, available_count)
    VALUES (NEW.room_type_id, check_date, total_units - COALESCE(NEW.quantity, 1))
    ON CONFLICT (room_type_id, date)
    DO UPDATE SET 
      available_count = room_inventory.available_count - COALESCE(NEW.quantity, 1),
      last_updated = now();
    
    -- Check if we have sufficient inventory after the update
    SELECT available_count INTO current_available
    FROM public.room_inventory
    WHERE room_type_id = NEW.room_type_id AND date = check_date;
    
    IF current_available < 0 THEN
      RAISE EXCEPTION 'Insufficient inventory for room type % on date %. Available: %, Requested: %', 
        NEW.room_type_id, check_date, current_available + COALESCE(NEW.quantity, 1), COALESCE(NEW.quantity, 1);
    END IF;
    
    check_date := check_date + INTERVAL '1 day';
  END LOOP;
  
  RETURN NEW;
END;
$$;

-- Function to handle inventory updates on booking delete (cancellation)
CREATE OR REPLACE FUNCTION public.handle_booking_inventory_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  check_date DATE;
BEGIN
  -- Skip if no room_type_id
  IF OLD.room_type_id IS NULL THEN
    RETURN OLD;
  END IF;

  -- Return inventory for each night in the cancelled booking
  check_date := OLD.check_in;
  WHILE check_date < OLD.check_out LOOP
    UPDATE public.room_inventory
    SET available_count = available_count + COALESCE(OLD.quantity, 1),
        last_updated = now()
    WHERE room_type_id = OLD.room_type_id AND date = check_date;
    
    check_date := check_date + INTERVAL '1 day';
  END LOOP;
  
  RETURN OLD;
END;
$$;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS booking_inventory_insert_trigger ON public.bookings;
DROP TRIGGER IF EXISTS booking_inventory_delete_trigger ON public.bookings;

-- Create triggers for atomic inventory management
CREATE TRIGGER booking_inventory_insert_trigger
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_booking_inventory_insert();

CREATE TRIGGER booking_inventory_delete_trigger
  AFTER DELETE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_booking_inventory_delete();

-- Enable RLS on new tables
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for room_types (public read, service role manage)
CREATE POLICY "room_types_public_read" ON public.room_types
  FOR SELECT USING (true);

CREATE POLICY "room_types_service_role_manage" ON public.room_types
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- RLS Policies for room_inventory (public read, service role manage)
CREATE POLICY "room_inventory_public_read" ON public.room_inventory
  FOR SELECT USING (true);

CREATE POLICY "room_inventory_service_role_manage" ON public.room_inventory
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- RLS Policies for pending_orders (service role only)
CREATE POLICY "pending_orders_service_role_only" ON public.pending_orders
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Update bookings RLS to include room availability check
DROP POLICY IF EXISTS "bookings_anonymous_insert_with_availability" ON public.bookings;
CREATE POLICY "bookings_anonymous_insert_with_availability" ON public.bookings
  FOR INSERT WITH CHECK (
    room_type_id IS NOT NULL AND 
    is_room_available(room_type_id, check_in, check_out, COALESCE(quantity, 1))
  );

-- Seed inventory for next 180 days (optional - allows immediate UI display)
DO $$
DECLARE
  room_record RECORD;
  days_ahead INTEGER := 180;
  seed_date DATE;
BEGIN
  FOR room_record IN SELECT id, total_units FROM public.room_types WHERE is_active = true LOOP
    seed_date := CURRENT_DATE;
    
    FOR i IN 0..days_ahead LOOP
      INSERT INTO public.room_inventory (room_type_id, date, available_count)
      VALUES (room_record.id, seed_date + i, room_record.total_units)
      ON CONFLICT (room_type_id, date) DO NOTHING;
    END LOOP;
  END LOOP;
END $$;

-- Enable realtime for room_inventory table
ALTER TABLE public.room_inventory REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_inventory;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_types;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_room_inventory_date ON public.room_inventory(date);
CREATE INDEX IF NOT EXISTS idx_room_inventory_room_type_date ON public.room_inventory(room_type_id, date);
CREATE INDEX IF NOT EXISTS idx_pending_orders_expires_at ON public.pending_orders(expires_at);
CREATE INDEX IF NOT EXISTS idx_bookings_room_type_dates ON public.bookings(room_type_id, check_in, check_out);