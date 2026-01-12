-- ============================================
-- Phase 2, 3, 4: Complete Database Schema for All Features
-- ============================================

-- 1. Property Onboarding Tables
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  address TEXT,
  city TEXT,
  state TEXT DEFAULT 'Meghalaya',
  pincode TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  property_type TEXT DEFAULT 'hostel' CHECK (property_type IN ('hostel', 'hotel', 'villa', 'resort')),
  total_rooms INTEGER DEFAULT 0,
  total_beds INTEGER DEFAULT 0,
  amenities JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  contact_email TEXT,
  contact_phone TEXT,
  gst_number TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Property onboarding status table
CREATE TABLE IF NOT EXISTS public.property_onboarding (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'review', 'live', 'suspended')),
  checklist JSONB DEFAULT '{
    "basic_info": false,
    "room_types": false,
    "inventory_setup": false,
    "pricing": false,
    "photos": false,
    "policies": false,
    "bank_details": false,
    "contract_signed": false
  }'::jsonb,
  readiness_score INTEGER DEFAULT 0,
  notes TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Room Types Master Table (per property)
CREATE TABLE IF NOT EXISTS public.property_room_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  short_name TEXT,
  category TEXT DEFAULT 'private' CHECK (category IN ('luxury', 'private', 'dormitory', 'economy')),
  base_price DECIMAL(10, 2) NOT NULL,
  max_guests INTEGER DEFAULT 2,
  total_units INTEGER DEFAULT 1,
  bed_configuration TEXT,
  amenities JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Dynamic Pricing Rules
CREATE TABLE IF NOT EXISTS public.pricing_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  room_type_id UUID REFERENCES public.property_room_types(id) ON DELETE CASCADE,
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('weekend', 'seasonal', 'event', 'last_minute', 'early_bird', 'occupancy')),
  modifier_type TEXT DEFAULT 'percentage' CHECK (modifier_type IN ('percentage', 'fixed')),
  modifier_value DECIMAL(10, 2) NOT NULL,
  start_date DATE,
  end_date DATE,
  days_of_week INTEGER[] DEFAULT ARRAY[0,1,2,3,4,5,6],
  min_lead_days INTEGER,
  max_lead_days INTEGER,
  occupancy_threshold INTEGER,
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. OTA Channel Connections (expanded)
CREATE TABLE IF NOT EXISTS public.ota_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  channel_name TEXT NOT NULL,
  channel_type TEXT DEFAULT 'ota' CHECK (channel_type IN ('ota', 'direct', 'meta', 'gds')),
  api_key TEXT,
  property_code TEXT,
  is_connected BOOLEAN DEFAULT false,
  last_sync_at TIMESTAMPTZ,
  sync_status TEXT DEFAULT 'pending',
  sync_error TEXT,
  rate_parity_enabled BOOLEAN DEFAULT true,
  commission_rate DECIMAL(5, 2),
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DPDP Consent Tracking
CREATE TABLE IF NOT EXISTS public.dpdp_consents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  consent_type TEXT NOT NULL CHECK (consent_type IN ('essential', 'analytics', 'marketing', 'personalization')),
  granted BOOLEAN DEFAULT false,
  granted_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  ip_address TEXT,
  user_agent TEXT,
  consent_version TEXT DEFAULT '1.0',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dpdp_consents_visitor ON public.dpdp_consents(visitor_id);
CREATE INDEX IF NOT EXISTS idx_dpdp_consents_type ON public.dpdp_consents(consent_type);

-- 6. Enhanced Traveller Profiles for GA360-grade
ALTER TABLE IF EXISTS public.traveller_profiles 
  ADD COLUMN IF NOT EXISTS device_fingerprint TEXT,
  ADD COLUMN IF NOT EXISTS consent_analytics BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_marketing BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_personalization BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS inactivity_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS attribution_source TEXT,
  ADD COLUMN IF NOT EXISTS attribution_medium TEXT,
  ADD COLUMN IF NOT EXISTS attribution_campaign TEXT,
  ADD COLUMN IF NOT EXISTS funnel_stage TEXT DEFAULT 'awareness',
  ADD COLUMN IF NOT EXISTS predicted_intent TEXT,
  ADD COLUMN IF NOT EXISTS is_high_intent BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_android BOOLEAN,
  ADD COLUMN IF NOT EXISTS is_ios BOOLEAN;

-- 7. GA360-Grade Analytics Views
CREATE TABLE IF NOT EXISTS public.analytics_visitors_detailed (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  hit_timestamp TIMESTAMPTZ DEFAULT NOW(),
  hit_type TEXT CHECK (hit_type IN ('pageview', 'event', 'transaction', 'social', 'timing')),
  page_path TEXT,
  page_title TEXT,
  event_category TEXT,
  event_action TEXT,
  event_label TEXT,
  event_value INTEGER,
  transaction_id TEXT,
  transaction_revenue DECIMAL(10, 2),
  device_category TEXT,
  device_os TEXT,
  device_browser TEXT,
  geo_country TEXT,
  geo_region TEXT,
  geo_city TEXT,
  traffic_source TEXT,
  traffic_medium TEXT,
  traffic_campaign TEXT,
  is_entrance BOOLEAN DEFAULT false,
  is_exit BOOLEAN DEFAULT false,
  time_on_page INTEGER,
  scroll_depth INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_visitors_detailed_visitor ON public.analytics_visitors_detailed(visitor_id);
CREATE INDEX IF NOT EXISTS idx_analytics_visitors_detailed_session ON public.analytics_visitors_detailed(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_visitors_detailed_timestamp ON public.analytics_visitors_detailed(hit_timestamp);

-- 8. Update traveller profiles to expire after 7 days inactivity
CREATE OR REPLACE FUNCTION expire_inactive_visitors()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE traveller_profiles 
  SET inactivity_expires_at = NOW()
  WHERE last_seen_at < NOW() - INTERVAL '7 days'
    AND inactivity_expires_at IS NULL;
END;
$$;

-- Enable RLS on new tables
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ota_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dpdp_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_visitors_detailed ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin access
CREATE POLICY "Admins can manage properties" ON public.properties FOR ALL USING (true);
CREATE POLICY "Admins can manage property_onboarding" ON public.property_onboarding FOR ALL USING (true);
CREATE POLICY "Admins can manage property_room_types" ON public.property_room_types FOR ALL USING (true);
CREATE POLICY "Admins can manage pricing_rules" ON public.pricing_rules FOR ALL USING (true);
CREATE POLICY "Admins can manage ota_connections" ON public.ota_connections FOR ALL USING (true);
CREATE POLICY "Public can insert consents" ON public.dpdp_consents FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view own consents" ON public.dpdp_consents FOR SELECT USING (true);
CREATE POLICY "Analytics data is admin only" ON public.analytics_visitors_detailed FOR ALL USING (true);

-- Function to calculate readiness score
CREATE OR REPLACE FUNCTION calculate_onboarding_readiness(checklist JSONB)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  total_items INTEGER := 8;
  completed_items INTEGER := 0;
BEGIN
  IF (checklist->>'basic_info')::boolean THEN completed_items := completed_items + 1; END IF;
  IF (checklist->>'room_types')::boolean THEN completed_items := completed_items + 1; END IF;
  IF (checklist->>'inventory_setup')::boolean THEN completed_items := completed_items + 1; END IF;
  IF (checklist->>'pricing')::boolean THEN completed_items := completed_items + 1; END IF;
  IF (checklist->>'photos')::boolean THEN completed_items := completed_items + 1; END IF;
  IF (checklist->>'policies')::boolean THEN completed_items := completed_items + 1; END IF;
  IF (checklist->>'bank_details')::boolean THEN completed_items := completed_items + 1; END IF;
  IF (checklist->>'contract_signed')::boolean THEN completed_items := completed_items + 1; END IF;
  
  RETURN (completed_items * 100 / total_items);
END;
$$;

-- Trigger to update readiness score
CREATE OR REPLACE FUNCTION update_readiness_score()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.readiness_score := calculate_onboarding_readiness(NEW.checklist);
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_update_readiness ON public.property_onboarding;
CREATE TRIGGER trigger_update_readiness
  BEFORE INSERT OR UPDATE ON public.property_onboarding
  FOR EACH ROW
  EXECUTE FUNCTION update_readiness_score();