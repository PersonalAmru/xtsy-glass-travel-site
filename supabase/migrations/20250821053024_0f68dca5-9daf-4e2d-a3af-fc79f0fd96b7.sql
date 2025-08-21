-- Create function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin',
    false
  );
$$;

-- Drop existing metrics policies that need to be replaced
DROP POLICY IF EXISTS "Metrics are viewable by authenticated users only" ON public.metrics;

-- Create new admin-only policy for metrics
CREATE POLICY "Metrics are viewable by admin users only"
ON public.metrics
FOR SELECT
TO authenticated
USING (is_admin());