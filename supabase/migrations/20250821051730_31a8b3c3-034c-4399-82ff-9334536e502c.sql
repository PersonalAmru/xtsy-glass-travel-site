-- Fix metrics table security - restrict public access to business analytics
DROP POLICY IF EXISTS "Metrics are viewable by everyone" ON public.metrics;

-- Create more restrictive policy for metrics access
CREATE POLICY "Metrics are viewable by authenticated users only"
ON public.metrics
FOR SELECT
TO authenticated, service_role
USING (true);

-- Allow service role to manage metrics
CREATE POLICY "Service role can manage metrics"
ON public.metrics
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);