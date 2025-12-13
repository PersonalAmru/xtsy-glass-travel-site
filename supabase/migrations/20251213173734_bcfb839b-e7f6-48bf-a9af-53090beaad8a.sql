-- Create mobile_ui_logs table for debugging mobile UI issues
CREATE TABLE public.mobile_ui_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Device info
  user_agent TEXT,
  screen_width INTEGER,
  screen_height INTEGER,
  viewport_width INTEGER,
  viewport_height INTEGER,
  device_pixel_ratio NUMERIC,
  
  -- Component info
  component_name TEXT NOT NULL,
  error_type TEXT NOT NULL,
  error_message TEXT,
  
  -- Computed device type
  device_type TEXT GENERATED ALWAYS AS (
    CASE 
      WHEN user_agent ILIKE '%iPhone%' OR user_agent ILIKE '%iPad%' THEN 'ios'
      WHEN user_agent ILIKE '%Android%' THEN 'android'
      ELSE 'desktop'
    END
  ) STORED,
  
  -- Additional context
  page_url TEXT,
  extra_data JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.mobile_ui_logs ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for error logging from frontend)
CREATE POLICY "mobile_ui_logs_public_insert" 
ON public.mobile_ui_logs 
FOR INSERT 
WITH CHECK (true);

-- Only admins can read logs
CREATE POLICY "mobile_ui_logs_admin_read" 
ON public.mobile_ui_logs 
FOR SELECT 
USING (is_admin_or_staff());

-- Service role has full access
CREATE POLICY "mobile_ui_logs_service_role_full" 
ON public.mobile_ui_logs 
FOR ALL 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Deny public select, update, delete
CREATE POLICY "mobile_ui_logs_deny_public_select" 
ON public.mobile_ui_logs 
FOR SELECT 
USING (false);

CREATE POLICY "mobile_ui_logs_deny_public_update" 
ON public.mobile_ui_logs 
FOR UPDATE 
USING (false);

CREATE POLICY "mobile_ui_logs_deny_public_delete" 
ON public.mobile_ui_logs 
FOR DELETE 
USING (false);

-- Add index for faster querying
CREATE INDEX idx_mobile_ui_logs_created_at ON public.mobile_ui_logs(created_at DESC);
CREATE INDEX idx_mobile_ui_logs_device_type ON public.mobile_ui_logs(device_type);
CREATE INDEX idx_mobile_ui_logs_component ON public.mobile_ui_logs(component_name);