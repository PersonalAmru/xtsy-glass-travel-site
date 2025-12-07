-- Create webhook_events table for OTA webhook processing
CREATE TABLE public.webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,
  event_type text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  processed boolean DEFAULT false,
  processing_attempts integer DEFAULT 0,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  error_message text
);

-- Create audit_logs table for tracking changes
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  record_id uuid,
  action text NOT NULL,
  old_values jsonb,
  new_values jsonb,
  user_agent text,
  user_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- webhook_events: Only service role can manage (edge functions use service role)
CREATE POLICY "webhook_events_service_role_full" ON public.webhook_events
  FOR ALL USING (auth.role() = 'service_role'::text)
  WITH CHECK (auth.role() = 'service_role'::text);

-- webhook_events: Admins can read for monitoring
CREATE POLICY "webhook_events_admin_read" ON public.webhook_events
  FOR SELECT USING (is_admin_or_staff());

-- webhook_events: Deny public access
CREATE POLICY "webhook_events_deny_public" ON public.webhook_events
  FOR ALL USING (false) WITH CHECK (false);

-- audit_logs: Only service role can insert
CREATE POLICY "audit_logs_service_role_insert" ON public.audit_logs
  FOR INSERT WITH CHECK (auth.role() = 'service_role'::text);

-- audit_logs: Admins can read for auditing
CREATE POLICY "audit_logs_admin_read" ON public.audit_logs
  FOR SELECT USING (is_admin_or_staff());

-- audit_logs: Deny public write access
CREATE POLICY "audit_logs_deny_public_write" ON public.audit_logs
  FOR INSERT WITH CHECK (false);

CREATE POLICY "audit_logs_deny_public_update" ON public.audit_logs
  FOR UPDATE USING (false);

CREATE POLICY "audit_logs_deny_public_delete" ON public.audit_logs
  FOR DELETE USING (false);

-- Create indexes for performance
CREATE INDEX idx_webhook_events_source ON public.webhook_events(source);
CREATE INDEX idx_webhook_events_processed ON public.webhook_events(processed);
CREATE INDEX idx_webhook_events_created_at ON public.webhook_events(created_at);
CREATE INDEX idx_audit_logs_table_name ON public.audit_logs(table_name);
CREATE INDEX idx_audit_logs_record_id ON public.audit_logs(record_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);