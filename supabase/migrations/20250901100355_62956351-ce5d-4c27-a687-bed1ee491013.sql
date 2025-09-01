-- Part A: Remove PII logging table and enable RLS on remaining tables
-- Drop the whatsapp_logs table completely to ensure no PII logging
DROP TABLE IF EXISTS public.whatsapp_logs;

-- Enable RLS on tables that may contain PII and don't have it enabled
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;

-- Create deny-by-default policies for bookings (containing PII)
CREATE POLICY "bookings_deny_all" ON public.bookings FOR ALL USING (false);

-- Create admin-only access policy for bookings (staff/admin role check)
CREATE POLICY "bookings_admin_access" ON public.bookings FOR ALL 
USING (
  (current_setting('request.jwt.claims', true)::jsonb ->> 'user_metadata')::jsonb ->> 'role' IN ('admin', 'staff')
);

-- Create deny-by-default policies for transactions
CREATE POLICY "transactions_deny_all" ON public.transactions FOR ALL USING (false);

-- Create admin-only access policy for transactions
CREATE POLICY "transactions_admin_access" ON public.transactions FOR ALL 
USING (
  (current_setting('request.jwt.claims', true)::jsonb ->> 'user_metadata')::jsonb ->> 'role' IN ('admin', 'staff')
);

-- Allow public read access to metrics (for happy guests counter, etc.)
CREATE POLICY "metrics_public_read" ON public.metrics FOR SELECT USING (true);

-- Only admins can modify metrics
CREATE POLICY "metrics_admin_write" ON public.metrics FOR INSERT WITH CHECK (
  (current_setting('request.jwt.claims', true)::jsonb ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
);

CREATE POLICY "metrics_admin_update" ON public.metrics FOR UPDATE USING (
  (current_setting('request.jwt.claims', true)::jsonb ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
);

-- Set data retention comments (for future reference)
COMMENT ON TABLE public.bookings IS 'PII data - implement automated deletion after 7 years per GDPR Article 17';
COMMENT ON TABLE public.transactions IS 'Financial data - retain per local tax law requirements, typically 7-10 years';