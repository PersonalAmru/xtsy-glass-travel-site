-- Allow public read access to metrics table
-- This enables anonymous users to see the happy guests count on the website
CREATE POLICY "metrics_public_read_only"
ON public.metrics
FOR SELECT
TO public
USING (true);