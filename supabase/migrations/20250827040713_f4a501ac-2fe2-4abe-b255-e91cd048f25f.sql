
-- Insert or update the happy_guests metric with baseline value of 610
INSERT INTO public.metrics (key, value, created_at, updated_at)
VALUES ('happy_guests', 610, now(), now())
ON CONFLICT (key) 
DO UPDATE SET 
  value = GREATEST(EXCLUDED.value, metrics.value),
  updated_at = now();

-- Create a function to safely increment the happy guests count
CREATE OR REPLACE FUNCTION public.increment_happy_guests()
RETURNS TABLE(new_count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.metrics 
  SET value = value + 1, updated_at = now()
  WHERE key = 'happy_guests';
  
  RETURN QUERY 
  SELECT value FROM public.metrics WHERE key = 'happy_guests';
END;
$$;

-- Grant execute permission to anon users for the increment function
GRANT EXECUTE ON FUNCTION public.increment_happy_guests() TO anon;
