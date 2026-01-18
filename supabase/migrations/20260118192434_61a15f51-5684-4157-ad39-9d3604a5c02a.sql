-- Create security intrusion logs table for tracking unauthorized access attempts
CREATE TABLE IF NOT EXISTS public.security_intrusion_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL, -- 'admin_login_attempt', 'unauthorized_access', 'brute_force', 'suspicious_activity'
  severity TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  email TEXT,
  ip_address TEXT,
  user_agent TEXT,
  device_fingerprint TEXT,
  geo_location JSONB, -- { country, city, region, latitude, longitude }
  device_info JSONB, -- { browser, os, device_type, screen_resolution, timezone }
  attempt_details JSONB, -- { reason, admin_email_attempted, error_message }
  is_acknowledged BOOLEAN DEFAULT false,
  acknowledged_at TIMESTAMPTZ,
  acknowledged_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_security_intrusion_logs_created_at ON public.security_intrusion_logs(created_at DESC);
CREATE INDEX idx_security_intrusion_logs_severity ON public.security_intrusion_logs(severity);
CREATE INDEX idx_security_intrusion_logs_event_type ON public.security_intrusion_logs(event_type);
CREATE INDEX idx_security_intrusion_logs_acknowledged ON public.security_intrusion_logs(is_acknowledged);

-- Enable RLS
ALTER TABLE public.security_intrusion_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view intrusion logs
CREATE POLICY "Admins can view intrusion logs"
ON public.security_intrusion_logs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can update intrusion logs (acknowledge)
CREATE POLICY "Admins can update intrusion logs"
ON public.security_intrusion_logs
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Anyone can insert intrusion logs (for logging unauthorized attempts)
CREATE POLICY "Anyone can insert intrusion logs"
ON public.security_intrusion_logs
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Create admin security alerts table for real-time notifications
CREATE TABLE IF NOT EXISTS public.admin_security_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  intrusion_log_id UUID REFERENCES public.security_intrusion_logs(id) ON DELETE CASCADE,
  alert_title TEXT NOT NULL,
  alert_message TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'high',
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_security_alerts ENABLE ROW LEVEL SECURITY;

-- Only admins can view/update security alerts
CREATE POLICY "Admins can view security alerts"
ON public.admin_security_alerts
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update security alerts"
ON public.admin_security_alerts
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert security alerts"
ON public.admin_security_alerts
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Create function to automatically create alert when intrusion is logged
CREATE OR REPLACE FUNCTION public.create_security_alert_on_intrusion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.severity IN ('high', 'critical') THEN
    INSERT INTO public.admin_security_alerts (
      intrusion_log_id,
      alert_title,
      alert_message,
      severity
    ) VALUES (
      NEW.id,
      CASE 
        WHEN NEW.event_type = 'unauthorized_access' THEN '🚨 UNAUTHORIZED ACCESS ATTEMPT'
        WHEN NEW.event_type = 'brute_force' THEN '⚠️ BRUTE FORCE DETECTED'
        WHEN NEW.event_type = 'admin_login_attempt' THEN '🔐 ADMIN LOGIN ATTEMPT'
        ELSE '⚡ SECURITY ALERT'
      END,
      'Email: ' || COALESCE(NEW.email, 'Unknown') || 
      ' | IP: ' || COALESCE(NEW.ip_address, 'Unknown') ||
      ' | Location: ' || COALESCE(NEW.geo_location->>'city', 'Unknown') || ', ' || COALESCE(NEW.geo_location->>'country', 'Unknown'),
      NEW.severity
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_create_security_alert ON public.security_intrusion_logs;
CREATE TRIGGER trigger_create_security_alert
  AFTER INSERT ON public.security_intrusion_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.create_security_alert_on_intrusion();