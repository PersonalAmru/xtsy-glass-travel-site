-- Create blocked_dates table for admin date blocking
CREATE TABLE IF NOT EXISTS public.blocked_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_type TEXT NOT NULL,
  date DATE NOT NULL,
  blocked BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (room_type, date)
);

-- Enable RLS
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read blocked dates
CREATE POLICY "authenticated_can_read_blocked_dates"
ON public.blocked_dates
FOR SELECT
TO authenticated
USING (true);

-- Service role can manage all blocked dates
CREATE POLICY "service_role_manage_blocked_dates"
ON public.blocked_dates
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Admin users can manage blocked dates
CREATE POLICY "admin_can_manage_blocked_dates"
ON public.blocked_dates
FOR ALL
TO authenticated
USING (is_admin_or_staff())
WITH CHECK (is_admin_or_staff());

-- Add realtime support
ALTER TABLE public.blocked_dates REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.blocked_dates;