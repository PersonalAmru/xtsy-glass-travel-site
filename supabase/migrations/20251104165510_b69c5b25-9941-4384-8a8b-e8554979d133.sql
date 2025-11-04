-- Reset happy guests counter to 0
UPDATE public.metrics
SET value = 0,
    updated_at = now()
WHERE key = 'happy_guests';

-- If the record doesn't exist, create it
INSERT INTO public.metrics (key, value)
VALUES ('happy_guests', 0)
ON CONFLICT (key) DO NOTHING;