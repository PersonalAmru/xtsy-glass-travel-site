-- =============================================
-- SMART ANALYTICS & TRAFFIC DEFENSE SYSTEM
-- Complete Database Schema
-- =============================================

-- TABLE: traffic_sessions (Main session tracking)
CREATE TABLE IF NOT EXISTS public.traffic_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  visitor_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ,
  last_activity_at TIMESTAMPTZ DEFAULT now(),
  duration_seconds INTEGER DEFAULT 0,
  
  -- Device Intelligence
  device_type TEXT CHECK (device_type IN ('mobile', 'tablet', 'desktop')),
  operating_system TEXT,
  user_device_tier TEXT CHECK (user_device_tier IN ('premium', 'standard', 'neutral')) DEFAULT 'neutral',
  browser TEXT,
  screen_width INTEGER,
  screen_height INTEGER,
  
  -- Geo Intelligence
  country TEXT,
  country_code TEXT,
  state TEXT,
  city TEXT,
  timezone TEXT,
  latitude NUMERIC(10, 6),
  longitude NUMERIC(10, 6),
  ip_hash TEXT, -- Anonymized IP
  
  -- Traffic Quality Scoring
  bot_likelihood_score INTEGER DEFAULT 0 CHECK (bot_likelihood_score >= 0 AND bot_likelihood_score <= 100),
  traffic_quality TEXT CHECK (traffic_quality IN ('high', 'medium', 'low', 'junk')) DEFAULT 'medium',
  click_quality_score INTEGER DEFAULT 50 CHECK (click_quality_score >= 0 AND click_quality_score <= 100),
  unified_intent_score INTEGER DEFAULT 0 CHECK (unified_intent_score >= 0 AND unified_intent_score <= 100),
  intent_category TEXT CHECK (intent_category IN ('junk', 'low', 'medium', 'high', 'hot')) DEFAULT 'low',
  
  -- Consent & Compliance
  consent_state JSONB DEFAULT '{"analytics": false, "marketing": false, "personalization": false}'::jsonb,
  consent_granted_at TIMESTAMPTZ,
  
  -- Attribution
  landing_page TEXT,
  exit_page TEXT,
  referrer_url TEXT,
  referrer_source TEXT,
  referrer_medium TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  
  -- Engagement Metrics
  page_views INTEGER DEFAULT 0,
  max_scroll_depth INTEGER DEFAULT 0,
  total_interactions INTEGER DEFAULT 0,
  
  -- Validation Flags
  is_validated BOOLEAN DEFAULT FALSE,
  is_bot BOOLEAN DEFAULT FALSE,
  is_bounce BOOLEAN DEFAULT TRUE,
  
  -- GA4 Sync
  sent_to_ga4 BOOLEAN DEFAULT FALSE,
  sent_to_ga4_at TIMESTAMPTZ
);

-- TABLE: traffic_page_events
CREATE TABLE IF NOT EXISTS public.traffic_page_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES public.traffic_sessions(session_id) ON DELETE CASCADE,
  page_url TEXT NOT NULL,
  page_path TEXT,
  page_title TEXT,
  referrer TEXT,
  entry_timestamp TIMESTAMPTZ DEFAULT now(),
  exit_timestamp TIMESTAMPTZ,
  time_spent_seconds INTEGER DEFAULT 0,
  scroll_depth INTEGER DEFAULT 0,
  interaction_count INTEGER DEFAULT 0,
  is_entrance BOOLEAN DEFAULT FALSE,
  is_exit BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE: traffic_interaction_events
CREATE TABLE IF NOT EXISTS public.traffic_interaction_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES public.traffic_sessions(session_id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('click', 'scroll', 'form', 'whatsapp', 'call', 'hover', 'video', 'download', 'share', 'custom')),
  event_name TEXT NOT NULL,
  event_category TEXT,
  event_timestamp TIMESTAMPTZ DEFAULT now(),
  page_url TEXT,
  element_id TEXT,
  element_class TEXT,
  element_text TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_validated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE: traffic_validated_events (Only validated events for GA4/Ads)
CREATE TABLE IF NOT EXISTS public.traffic_validated_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES public.traffic_sessions(session_id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  event_category TEXT,
  validation_passed BOOLEAN NOT NULL DEFAULT FALSE,
  validation_reason TEXT,
  validation_rules_met JSONB DEFAULT '[]'::jsonb,
  
  -- Conversion Data
  conversion_value NUMERIC(10, 2) DEFAULT 0,
  currency TEXT DEFAULT 'INR',
  
  -- Device Tier Value Multiplier Applied
  value_multiplier NUMERIC(3, 2) DEFAULT 1.0,
  adjusted_conversion_value NUMERIC(10, 2) DEFAULT 0,
  
  -- GA4/Ads Sync
  sent_to_ga4 BOOLEAN DEFAULT FALSE,
  sent_to_ga4_at TIMESTAMPTZ,
  sent_to_ads BOOLEAN DEFAULT FALSE,
  sent_to_ads_at TIMESTAMPTZ,
  
  -- Quality Scores at Event Time
  click_quality_score INTEGER,
  unified_intent_score INTEGER,
  intent_category TEXT,
  user_device_tier TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE: traffic_lead_events
CREATE TABLE IF NOT EXISTS public.traffic_lead_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES public.traffic_sessions(session_id) ON DELETE CASCADE,
  visitor_id TEXT,
  lead_stage TEXT NOT NULL CHECK (lead_stage IN ('awareness', 'interest', 'consideration', 'intent', 'qualified', 'booking', 'converted')),
  lead_source TEXT,
  lead_value NUMERIC(10, 2) DEFAULT 0,
  
  -- Contact Info (Encrypted/Hashed)
  contact_hash TEXT,
  contact_type TEXT CHECK (contact_type IN ('whatsapp', 'call', 'email', 'form')),
  
  -- Attribution
  first_touch_source TEXT,
  last_touch_source TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE: consent_records (GDPR/DPDP Compliance)
CREATE TABLE IF NOT EXISTS public.consent_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL,
  session_id TEXT,
  
  -- Consent States
  analytics_storage BOOLEAN DEFAULT FALSE,
  ad_storage BOOLEAN DEFAULT FALSE,
  ad_user_data BOOLEAN DEFAULT FALSE,
  ad_personalization BOOLEAN DEFAULT FALSE,
  functionality_storage BOOLEAN DEFAULT TRUE,
  security_storage BOOLEAN DEFAULT TRUE,
  
  -- Metadata
  consent_version TEXT DEFAULT 'v2.0',
  consent_method TEXT CHECK (consent_method IN ('banner', 'settings', 'implied', 'explicit')),
  ip_hash TEXT,
  user_agent TEXT,
  
  -- Timestamps
  granted_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now(),
  revoked_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE: bot_detection_logs
CREATE TABLE IF NOT EXISTS public.bot_detection_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT,
  visitor_id TEXT,
  detection_type TEXT NOT NULL,
  detection_score INTEGER DEFAULT 0,
  detection_signals JSONB DEFAULT '[]'::jsonb,
  is_confirmed_bot BOOLEAN DEFAULT FALSE,
  action_taken TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_traffic_sessions_session_id ON public.traffic_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_traffic_sessions_visitor_id ON public.traffic_sessions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_traffic_sessions_created_at ON public.traffic_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_traffic_sessions_intent_category ON public.traffic_sessions(intent_category);
CREATE INDEX IF NOT EXISTS idx_traffic_sessions_traffic_quality ON public.traffic_sessions(traffic_quality);
CREATE INDEX IF NOT EXISTS idx_traffic_page_events_session_id ON public.traffic_page_events(session_id);
CREATE INDEX IF NOT EXISTS idx_traffic_interaction_events_session_id ON public.traffic_interaction_events(session_id);
CREATE INDEX IF NOT EXISTS idx_traffic_validated_events_session_id ON public.traffic_validated_events(session_id);
CREATE INDEX IF NOT EXISTS idx_traffic_lead_events_session_id ON public.traffic_lead_events(session_id);
CREATE INDEX IF NOT EXISTS idx_consent_records_visitor_id ON public.consent_records(visitor_id);

-- Enable RLS
ALTER TABLE public.traffic_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traffic_page_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traffic_interaction_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traffic_validated_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traffic_lead_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_detection_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow inserts from anonymous users for tracking
CREATE POLICY "Allow anonymous inserts for tracking" ON public.traffic_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous updates for tracking" ON public.traffic_sessions FOR UPDATE USING (true);
CREATE POLICY "Admin can view all sessions" ON public.traffic_sessions FOR SELECT USING (true);

CREATE POLICY "Allow anonymous inserts for page events" ON public.traffic_page_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous updates for page events" ON public.traffic_page_events FOR UPDATE USING (true);
CREATE POLICY "Admin can view all page events" ON public.traffic_page_events FOR SELECT USING (true);

CREATE POLICY "Allow anonymous inserts for interactions" ON public.traffic_interaction_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view all interactions" ON public.traffic_interaction_events FOR SELECT USING (true);

CREATE POLICY "Allow anonymous inserts for validated events" ON public.traffic_validated_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view all validated events" ON public.traffic_validated_events FOR SELECT USING (true);

CREATE POLICY "Allow anonymous inserts for leads" ON public.traffic_lead_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view all leads" ON public.traffic_lead_events FOR SELECT USING (true);

CREATE POLICY "Allow anonymous inserts for consent" ON public.consent_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous updates for consent" ON public.consent_records FOR UPDATE USING (true);
CREATE POLICY "Admin can view all consent" ON public.consent_records FOR SELECT USING (true);

CREATE POLICY "Allow anonymous inserts for bot logs" ON public.bot_detection_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view all bot logs" ON public.bot_detection_logs FOR SELECT USING (true);

-- Function to compute unified intent score
CREATE OR REPLACE FUNCTION compute_intent_score(
  p_duration_seconds INTEGER,
  p_page_views INTEGER,
  p_scroll_depth INTEGER,
  p_interaction_count INTEGER,
  p_device_tier TEXT,
  p_bot_likelihood INTEGER
) RETURNS INTEGER AS $$
DECLARE
  base_score INTEGER := 0;
  duration_score INTEGER;
  engagement_score INTEGER;
  device_bonus INTEGER;
  bot_penalty INTEGER;
  final_score INTEGER;
BEGIN
  -- Duration score (0-25 points)
  duration_score := LEAST(25, (p_duration_seconds / 12)); -- Max at 5 min
  
  -- Engagement score (0-50 points)
  engagement_score := LEAST(50, (
    (LEAST(p_page_views, 10) * 3) + -- Up to 30 points
    (p_scroll_depth / 5) + -- Up to 20 points
    (LEAST(p_interaction_count, 20) * 1) -- Up to 20 points (capped)
  ));
  
  -- Device tier bonus (0-15 points)
  device_bonus := CASE p_device_tier
    WHEN 'premium' THEN 15
    WHEN 'standard' THEN 5
    ELSE 0
  END;
  
  -- Bot penalty (0-40 points reduction)
  bot_penalty := (p_bot_likelihood * 40) / 100;
  
  -- Calculate final score
  final_score := duration_score + engagement_score + device_bonus - bot_penalty;
  
  -- Clamp between 0 and 100
  RETURN GREATEST(0, LEAST(100, final_score));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to categorize intent
CREATE OR REPLACE FUNCTION categorize_intent(score INTEGER) RETURNS TEXT AS $$
BEGIN
  RETURN CASE
    WHEN score >= 80 THEN 'hot'
    WHEN score >= 60 THEN 'high'
    WHEN score >= 40 THEN 'medium'
    WHEN score >= 20 THEN 'low'
    ELSE 'junk'
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to categorize traffic quality
CREATE OR REPLACE FUNCTION categorize_traffic_quality(
  intent_score INTEGER,
  bot_likelihood INTEGER,
  is_bounce BOOLEAN
) RETURNS TEXT AS $$
BEGIN
  IF bot_likelihood > 70 THEN
    RETURN 'junk';
  ELSIF is_bounce AND intent_score < 20 THEN
    RETURN 'low';
  ELSIF intent_score >= 60 THEN
    RETURN 'high';
  ELSIF intent_score >= 30 THEN
    RETURN 'medium';
  ELSE
    RETURN 'low';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;