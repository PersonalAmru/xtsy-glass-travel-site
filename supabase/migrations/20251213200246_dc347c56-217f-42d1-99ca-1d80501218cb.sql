-- =====================================================
-- TRAVELLER INTELLIGENCE SYSTEM - DATABASE SCHEMA
-- Privacy-safe, GDPR-friendly, investor-ready
-- =====================================================

-- 1. Unified Traveller Profile (no raw PII - only anonymous IDs and derived intelligence)
CREATE TABLE public.traveller_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT UNIQUE NOT NULL,
  profile_hash TEXT,
  
  -- Derived Intelligence Fields
  traveller_segment TEXT DEFAULT 'explorer',
  spend_tier TEXT DEFAULT 'budget',
  lifetime_value NUMERIC DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  total_nights INTEGER DEFAULT 0,
  avg_booking_value NUMERIC DEFAULT 0,
  
  -- Behavioral Signals
  preferred_room_category TEXT,
  preferred_booking_lead_days INTEGER,
  preferred_season TEXT,
  is_repeat_traveller BOOLEAN DEFAULT FALSE,
  is_group_organizer BOOLEAN DEFAULT FALSE,
  is_solo_traveller BOOLEAN DEFAULT FALSE,
  
  -- Engagement Metrics
  total_sessions INTEGER DEFAULT 0,
  total_pageviews INTEGER DEFAULT 0,
  avg_session_duration INTEGER DEFAULT 0,
  last_page_viewed TEXT,
  
  -- Intent Signals
  booking_intent_score INTEGER DEFAULT 0,
  tour_interest_score INTEGER DEFAULT 0,
  
  -- Attribution
  first_touch_source TEXT,
  first_touch_medium TEXT,
  first_touch_campaign TEXT,
  last_touch_source TEXT,
  last_touch_medium TEXT,
  
  -- Timestamps
  first_seen_at TIMESTAMPTZ DEFAULT now(),
  last_seen_at TIMESTAMPTZ DEFAULT now(),
  first_booking_at TIMESTAMPTZ,
  last_booking_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Traveller Events (Unified Event Stream - scalable)
CREATE TABLE public.traveller_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL,
  session_id TEXT,
  
  event_type TEXT NOT NULL,
  event_category TEXT,
  event_action TEXT,
  event_label TEXT,
  event_value NUMERIC,
  
  -- Context
  page_path TEXT,
  referrer TEXT,
  device_type TEXT,
  country_code TEXT,
  city TEXT,
  
  -- Flexible metadata
  properties JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Traveller Segments (Pre-computed segment definitions and stats)
CREATE TABLE public.traveller_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  segment_name TEXT UNIQUE NOT NULL,
  segment_key TEXT UNIQUE NOT NULL,
  segment_description TEXT,
  segment_criteria JSONB DEFAULT '{}',
  segment_color TEXT DEFAULT '#6366f1',
  
  -- Computed Stats
  traveller_count INTEGER DEFAULT 0,
  avg_lifetime_value NUMERIC DEFAULT 0,
  avg_booking_value NUMERIC DEFAULT 0,
  conversion_rate NUMERIC DEFAULT 0,
  total_revenue NUMERIC DEFAULT 0,
  
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Demand Forecast Cache
CREATE TABLE public.demand_forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  forecast_date DATE NOT NULL,
  room_type_id TEXT,
  room_type_name TEXT,
  
  predicted_demand INTEGER DEFAULT 0,
  predicted_revenue NUMERIC DEFAULT 0,
  confidence_score NUMERIC DEFAULT 0.5,
  demand_level TEXT DEFAULT 'normal',
  
  demand_factors JSONB DEFAULT '{}',
  
  actual_demand INTEGER,
  actual_revenue NUMERIC,
  forecast_accuracy NUMERIC,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(forecast_date, room_type_id)
);

-- 5. Revenue Intelligence Snapshots (Daily aggregated metrics)
CREATE TABLE public.revenue_intelligence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date DATE NOT NULL UNIQUE,
  
  -- Revenue Metrics
  total_revenue NUMERIC DEFAULT 0,
  booking_count INTEGER DEFAULT 0,
  avg_booking_value NUMERIC DEFAULT 0,
  revenue_per_visitor NUMERIC DEFAULT 0,
  
  -- Visitor Metrics
  total_visitors INTEGER DEFAULT 0,
  new_visitors INTEGER DEFAULT 0,
  returning_visitors INTEGER DEFAULT 0,
  conversion_rate NUMERIC DEFAULT 0,
  
  -- Segment Performance
  segment_breakdown JSONB DEFAULT '{}',
  
  -- Room Performance
  room_type_breakdown JSONB DEFAULT '{}',
  
  -- Source Attribution
  revenue_by_source JSONB DEFAULT '{}',
  
  -- Geographic Performance
  revenue_by_country JSONB DEFAULT '{}',
  
  -- Forecasts
  next_7d_forecast NUMERIC DEFAULT 0,
  next_30d_forecast NUMERIC DEFAULT 0,
  
  -- Trends
  revenue_trend NUMERIC DEFAULT 0,
  booking_trend NUMERIC DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_traveller_profiles_visitor ON public.traveller_profiles(visitor_id);
CREATE INDEX idx_traveller_profiles_segment ON public.traveller_profiles(traveller_segment);
CREATE INDEX idx_traveller_profiles_spend ON public.traveller_profiles(spend_tier);
CREATE INDEX idx_traveller_profiles_last_seen ON public.traveller_profiles(last_seen_at DESC);
CREATE INDEX idx_traveller_profiles_lifetime_value ON public.traveller_profiles(lifetime_value DESC);

CREATE INDEX idx_traveller_events_visitor ON public.traveller_events(visitor_id);
CREATE INDEX idx_traveller_events_session ON public.traveller_events(session_id);
CREATE INDEX idx_traveller_events_type ON public.traveller_events(event_type);
CREATE INDEX idx_traveller_events_category ON public.traveller_events(event_category);
CREATE INDEX idx_traveller_events_created ON public.traveller_events(created_at DESC);
CREATE INDEX idx_traveller_events_visitor_created ON public.traveller_events(visitor_id, created_at DESC);

CREATE INDEX idx_demand_forecasts_date ON public.demand_forecasts(forecast_date);
CREATE INDEX idx_demand_forecasts_room ON public.demand_forecasts(room_type_id);

CREATE INDEX idx_revenue_intelligence_date ON public.revenue_intelligence(snapshot_date DESC);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.traveller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traveller_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traveller_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demand_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_intelligence ENABLE ROW LEVEL SECURITY;

-- Traveller Profiles Policies
CREATE POLICY "traveller_profiles_admin_read" ON public.traveller_profiles
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "traveller_profiles_service_role_all" ON public.traveller_profiles
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "traveller_profiles_deny_public" ON public.traveller_profiles
  FOR ALL USING (false) WITH CHECK (false);

-- Traveller Events Policies
CREATE POLICY "traveller_events_admin_read" ON public.traveller_events
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "traveller_events_service_role_all" ON public.traveller_events
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "traveller_events_deny_public" ON public.traveller_events
  FOR ALL USING (false) WITH CHECK (false);

-- Traveller Segments Policies
CREATE POLICY "traveller_segments_admin_read" ON public.traveller_segments
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "traveller_segments_service_role_all" ON public.traveller_segments
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "traveller_segments_deny_public" ON public.traveller_segments
  FOR ALL USING (false) WITH CHECK (false);

-- Demand Forecasts Policies
CREATE POLICY "demand_forecasts_admin_read" ON public.demand_forecasts
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "demand_forecasts_service_role_all" ON public.demand_forecasts
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "demand_forecasts_deny_public" ON public.demand_forecasts
  FOR ALL USING (false) WITH CHECK (false);

-- Revenue Intelligence Policies
CREATE POLICY "revenue_intelligence_admin_read" ON public.revenue_intelligence
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "revenue_intelligence_service_role_all" ON public.revenue_intelligence
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "revenue_intelligence_deny_public" ON public.revenue_intelligence
  FOR ALL USING (false) WITH CHECK (false);

-- =====================================================
-- SEED DEFAULT SEGMENTS
-- =====================================================

INSERT INTO public.traveller_segments (segment_name, segment_key, segment_description, segment_color, segment_criteria) VALUES
  ('Loyal Travellers', 'loyal', 'Repeat guests with 3+ bookings', '#10b981', '{"min_bookings": 3}'),
  ('Luxury Seekers', 'luxury', 'Guests preferring premium rooms with high booking value', '#8b5cf6', '{"preferred_room_category": "luxury", "min_avg_booking": 5000}'),
  ('Budget Explorers', 'budget_explorer', 'Cost-conscious travellers preferring dormitories', '#f59e0b', '{"preferred_room_category": "dormitory"}'),
  ('Solo Adventurers', 'solo', 'Individual travellers exploring alone', '#3b82f6', '{"is_solo_traveller": true}'),
  ('Group Organizers', 'group_organizer', 'Leaders who organize group trips', '#ec4899', '{"is_group_organizer": true}'),
  ('High Intent', 'high_intent', 'Visitors showing strong booking signals', '#ef4444', '{"min_intent_score": 70}'),
  ('New Explorers', 'new_explorer', 'First-time visitors discovering XTSY', '#6b7280', '{"max_sessions": 2}');

-- =====================================================
-- FUNCTION: Update traveller profile from events
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_traveller_profile_from_event()
RETURNS TRIGGER AS $$
BEGIN
  -- Upsert traveller profile
  INSERT INTO public.traveller_profiles (visitor_id, last_seen_at, total_sessions, last_page_viewed)
  VALUES (NEW.visitor_id, now(), 1, NEW.page_path)
  ON CONFLICT (visitor_id) DO UPDATE SET
    last_seen_at = now(),
    total_pageviews = traveller_profiles.total_pageviews + 1,
    last_page_viewed = COALESCE(NEW.page_path, traveller_profiles.last_page_viewed),
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic profile updates
CREATE TRIGGER trigger_update_traveller_profile
  AFTER INSERT ON public.traveller_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_traveller_profile_from_event();

-- =====================================================
-- FUNCTION: Classify traveller segment
-- =====================================================

CREATE OR REPLACE FUNCTION public.classify_traveller_segment(p_visitor_id TEXT)
RETURNS TEXT AS $$
DECLARE
  profile RECORD;
  segment TEXT := 'new_explorer';
BEGIN
  SELECT * INTO profile FROM public.traveller_profiles WHERE visitor_id = p_visitor_id;
  
  IF NOT FOUND THEN
    RETURN 'new_explorer';
  END IF;
  
  -- Classification logic
  IF profile.total_bookings >= 3 THEN
    segment := 'loyal';
  ELSIF profile.is_group_organizer THEN
    segment := 'group_organizer';
  ELSIF profile.preferred_room_category = 'luxury' OR profile.avg_booking_value > 5000 THEN
    segment := 'luxury';
  ELSIF profile.is_solo_traveller THEN
    segment := 'solo';
  ELSIF profile.preferred_room_category = 'dormitory' THEN
    segment := 'budget_explorer';
  ELSIF profile.booking_intent_score >= 70 THEN
    segment := 'high_intent';
  ELSIF profile.total_sessions <= 2 THEN
    segment := 'new_explorer';
  END IF;
  
  -- Update the profile
  UPDATE public.traveller_profiles 
  SET traveller_segment = segment, updated_at = now()
  WHERE visitor_id = p_visitor_id;
  
  RETURN segment;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- =====================================================
-- FUNCTION: Calculate spend tier
-- =====================================================

CREATE OR REPLACE FUNCTION public.calculate_spend_tier(p_visitor_id TEXT)
RETURNS TEXT AS $$
DECLARE
  ltv NUMERIC;
  tier TEXT := 'budget';
BEGIN
  SELECT lifetime_value INTO ltv FROM public.traveller_profiles WHERE visitor_id = p_visitor_id;
  
  IF ltv IS NULL THEN
    RETURN 'budget';
  END IF;
  
  IF ltv >= 50000 THEN
    tier := 'high_value';
  ELSIF ltv >= 15000 THEN
    tier := 'medium';
  ELSE
    tier := 'budget';
  END IF;
  
  UPDATE public.traveller_profiles 
  SET spend_tier = tier, updated_at = now()
  WHERE visitor_id = p_visitor_id;
  
  RETURN tier;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- =====================================================
-- ENABLE REALTIME FOR LIVE DASHBOARD
-- =====================================================

ALTER TABLE public.traveller_events REPLICA IDENTITY FULL;
ALTER TABLE public.traveller_profiles REPLICA IDENTITY FULL;
ALTER TABLE public.revenue_intelligence REPLICA IDENTITY FULL;

-- Add tables to realtime publication (if not exists, create it)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE public.traveller_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.traveller_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.revenue_intelligence;