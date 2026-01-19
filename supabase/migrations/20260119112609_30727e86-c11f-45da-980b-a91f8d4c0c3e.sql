-- Enhanced Traffic Intelligence System Migration
-- Adds 3-layer defense, session scoring, visit tracking, and device capture

-- Add new columns to traffic_sessions for enhanced tracking
ALTER TABLE traffic_sessions 
ADD COLUMN IF NOT EXISTS visit_count INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS is_return_visitor BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS defense_layer_1_passed BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS defense_layer_2_passed BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS defense_layer_3_passed BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS defense_score INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS session_classification TEXT DEFAULT 'unknown',
ADD COLUMN IF NOT EXISTS active_scroll_seconds INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS meets_15s_threshold BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS whatsapp_clicked BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS whatsapp_validated BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS call_clicked BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS call_validated BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS device_model TEXT,
ADD COLUMN IF NOT EXISTS device_vendor TEXT,
ADD COLUMN IF NOT EXISTS browser_version TEXT,
ADD COLUMN IF NOT EXISTS os_version TEXT,
ADD COLUMN IF NOT EXISTS connection_type TEXT,
ADD COLUMN IF NOT EXISTS hardware_concurrency INTEGER,
ADD COLUMN IF NOT EXISTS device_memory NUMERIC,
ADD COLUMN IF NOT EXISTS touch_points INTEGER,
ADD COLUMN IF NOT EXISTS platform TEXT,
ADD COLUMN IF NOT EXISTS language TEXT,
ADD COLUMN IF NOT EXISTS languages JSONB,
ADD COLUMN IF NOT EXISTS color_depth INTEGER,
ADD COLUMN IF NOT EXISTS pixel_ratio NUMERIC,
ADD COLUMN IF NOT EXISTS timezone_offset INTEGER;

-- Create table for visitor history (for return visit tracking)
CREATE TABLE IF NOT EXISTS traffic_visitor_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL UNIQUE,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_sessions INTEGER DEFAULT 1,
  total_page_views INTEGER DEFAULT 0,
  avg_session_duration INTEGER DEFAULT 0,
  avg_intent_score INTEGER DEFAULT 0,
  highest_intent_score INTEGER DEFAULT 0,
  cumulative_defense_score INTEGER DEFAULT 100,
  is_known_bot BOOLEAN DEFAULT FALSE,
  is_known_junk BOOLEAN DEFAULT FALSE,
  is_hot_lead BOOLEAN DEFAULT FALSE,
  converted BOOLEAN DEFAULT FALSE,
  conversion_count INTEGER DEFAULT 0,
  total_conversion_value NUMERIC DEFAULT 0,
  preferred_device TEXT,
  preferred_os TEXT,
  country_code TEXT,
  city TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for fast visitor lookups
CREATE INDEX IF NOT EXISTS idx_visitor_history_visitor_id ON traffic_visitor_history(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitor_history_is_hot_lead ON traffic_visitor_history(is_hot_lead) WHERE is_hot_lead = TRUE;
CREATE INDEX IF NOT EXISTS idx_visitor_history_is_known_bot ON traffic_visitor_history(is_known_bot) WHERE is_known_bot = TRUE;

-- Create table for defense layer audit trail
CREATE TABLE IF NOT EXISTS traffic_defense_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  layer_number INTEGER NOT NULL CHECK (layer_number BETWEEN 1 AND 3),
  layer_name TEXT NOT NULL,
  check_name TEXT NOT NULL,
  check_passed BOOLEAN NOT NULL,
  check_score INTEGER DEFAULT 0,
  check_details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for defense logs
CREATE INDEX IF NOT EXISTS idx_defense_logs_session ON traffic_defense_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_defense_logs_visitor ON traffic_defense_logs(visitor_id);
CREATE INDEX IF NOT EXISTS idx_defense_logs_failed ON traffic_defense_logs(check_passed) WHERE check_passed = FALSE;

-- Add indexes to traffic_sessions for better filtering
CREATE INDEX IF NOT EXISTS idx_traffic_sessions_classification ON traffic_sessions(session_classification);
CREATE INDEX IF NOT EXISTS idx_traffic_sessions_defense_score ON traffic_sessions(defense_score);
CREATE INDEX IF NOT EXISTS idx_traffic_sessions_return_visitor ON traffic_sessions(is_return_visitor) WHERE is_return_visitor = TRUE;
CREATE INDEX IF NOT EXISTS idx_traffic_sessions_whatsapp_validated ON traffic_sessions(whatsapp_validated) WHERE whatsapp_validated = TRUE;
CREATE INDEX IF NOT EXISTS idx_traffic_sessions_call_validated ON traffic_sessions(call_validated) WHERE call_validated = TRUE;

-- Enable RLS on new tables
ALTER TABLE traffic_visitor_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_defense_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies - service role only for writes, admin-only for reads
CREATE POLICY "Service role can manage visitor history"
ON traffic_visitor_history
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role can manage defense logs"
ON traffic_defense_logs
FOR ALL
USING (true)
WITH CHECK (true);

-- Function to update visitor history on session start
CREATE OR REPLACE FUNCTION update_visitor_history()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO traffic_visitor_history (
    visitor_id,
    first_seen_at,
    last_seen_at,
    total_sessions,
    preferred_device,
    preferred_os,
    country_code,
    city
  ) VALUES (
    NEW.visitor_id,
    NEW.created_at,
    NEW.created_at,
    1,
    NEW.device_type,
    NEW.operating_system,
    NEW.country_code,
    NEW.city
  )
  ON CONFLICT (visitor_id) DO UPDATE SET
    last_seen_at = NEW.created_at,
    total_sessions = traffic_visitor_history.total_sessions + 1,
    updated_at = NOW();
  
  -- Update the session with return visitor status
  UPDATE traffic_sessions 
  SET 
    is_return_visitor = (SELECT total_sessions > 1 FROM traffic_visitor_history WHERE visitor_id = NEW.visitor_id),
    visit_count = (SELECT total_sessions FROM traffic_visitor_history WHERE visitor_id = NEW.visitor_id)
  WHERE session_id = NEW.session_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for visitor history
DROP TRIGGER IF EXISTS trigger_update_visitor_history ON traffic_sessions;
CREATE TRIGGER trigger_update_visitor_history
AFTER INSERT ON traffic_sessions
FOR EACH ROW
EXECUTE FUNCTION update_visitor_history();

-- Function to classify session based on defense scores
CREATE OR REPLACE FUNCTION classify_traffic_session(
  p_defense_score INTEGER,
  p_bot_likelihood INTEGER,
  p_intent_score INTEGER,
  p_active_scroll_seconds INTEGER
)
RETURNS TEXT AS $$
BEGIN
  -- Bot detection takes precedence
  IF p_bot_likelihood >= 70 THEN
    RETURN 'bot_detected';
  END IF;
  
  -- Defense layer failures
  IF p_defense_score < 30 THEN
    RETURN 'junk';
  END IF;
  
  -- Check 15-second active scroll threshold
  IF p_active_scroll_seconds < 15 THEN
    RETURN 'low_intent';
  END IF;
  
  -- Intent-based classification
  IF p_intent_score >= 80 AND p_defense_score >= 80 THEN
    RETURN 'hot_lead';
  ELSIF p_intent_score >= 60 AND p_defense_score >= 60 THEN
    RETURN 'high_intent';
  ELSIF p_intent_score >= 40 THEN
    RETURN 'medium_intent';
  ELSE
    RETURN 'low_intent';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Comment on new structures
COMMENT ON TABLE traffic_visitor_history IS 'Tracks visitor behavior across sessions for return visit scoring';
COMMENT ON TABLE traffic_defense_logs IS 'Audit trail for 3-layer defense system checks';
COMMENT ON COLUMN traffic_sessions.defense_score IS 'Combined score from 3-layer defense (0-100, higher is better)';
COMMENT ON COLUMN traffic_sessions.session_classification IS 'Classification: hot_lead, high_intent, medium_intent, low_intent, junk, bot_detected';