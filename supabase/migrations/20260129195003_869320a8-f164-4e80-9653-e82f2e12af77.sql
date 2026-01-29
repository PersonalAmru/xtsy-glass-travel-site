-- ============================================
-- PROPERTY INVENTORY SETTINGS
-- Property-level default inventory controls
-- ============================================

CREATE TABLE IF NOT EXISTS public.property_inventory_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id),
  property_type TEXT NOT NULL,
  default_pricing_enabled BOOLEAN DEFAULT true,
  date_blocking_enabled BOOLEAN DEFAULT true,
  bulk_operations_enabled BOOLEAN DEFAULT true,
  auto_price_adjustment BOOLEAN DEFAULT false,
  weekend_rate_multiplier DECIMAL(3,2) DEFAULT 1.0,
  seasonal_pricing_enabled BOOLEAN DEFAULT false,
  low_inventory_threshold INTEGER DEFAULT 2,
  settings_json JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(property_type)
);

-- Enable RLS
ALTER TABLE public.property_inventory_settings ENABLE ROW LEVEL SECURITY;

-- Authenticated users can view settings
CREATE POLICY "Authenticated users can view property inventory settings"
  ON public.property_inventory_settings FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can manage settings
CREATE POLICY "Authenticated users can manage property inventory settings"
  ON public.property_inventory_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- BULK DATE OPERATIONS LOG
-- Audit trail for bulk inventory changes
-- ============================================

CREATE TABLE IF NOT EXISTS public.inventory_bulk_operations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operation_type TEXT NOT NULL CHECK (operation_type IN ('block', 'unblock', 'price_change', 'discount')),
  room_type_id TEXT NOT NULL,
  property_type TEXT,
  dates_affected DATE[] NOT NULL,
  old_values JSONB,
  new_values JSONB NOT NULL,
  applied_by UUID REFERENCES auth.users(id),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT
);

-- Enable RLS
ALTER TABLE public.inventory_bulk_operations ENABLE ROW LEVEL SECURITY;

-- Authenticated users can view bulk operations
CREATE POLICY "Authenticated users can view bulk operations"
  ON public.inventory_bulk_operations FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can log bulk operations
CREATE POLICY "Authenticated users can log bulk operations"
  ON public.inventory_bulk_operations FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_bulk_operations_room ON public.inventory_bulk_operations(room_type_id);
CREATE INDEX IF NOT EXISTS idx_bulk_operations_date ON public.inventory_bulk_operations(applied_at);

-- ============================================
-- INSERT DEFAULT SETTINGS FOR ALL PROPERTIES
-- ============================================

INSERT INTO public.property_inventory_settings (property_type, default_pricing_enabled, date_blocking_enabled, bulk_operations_enabled)
VALUES 
  ('XTSY Luxury', true, true, true),
  ('XTSY Travellers Hostel', true, true, true),
  ('XTSY Economy', true, true, true)
ON CONFLICT (property_type) DO NOTHING;