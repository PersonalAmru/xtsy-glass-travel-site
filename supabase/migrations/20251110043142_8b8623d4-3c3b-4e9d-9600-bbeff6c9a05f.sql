-- Create rate_limits table for distributed rate limiting
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  endpoint text NOT NULL,
  request_count integer NOT NULL DEFAULT 1,
  window_start timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_rate_limit UNIQUE(ip_address, endpoint, window_start)
);

-- Enable RLS on rate_limits table
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Service role can manage all rate limits
CREATE POLICY "rate_limits_service_role_full_access" ON public.rate_limits
  FOR ALL USING (auth.role() = 'service_role');

-- Performance indexes for room availability queries
CREATE INDEX IF NOT EXISTS idx_room_inventory_lookup 
ON public.room_inventory(room_type_id, date, available_count);

CREATE INDEX IF NOT EXISTS idx_room_inventory_date_range 
ON public.room_inventory(room_type_id, date);

-- Index for booking date range queries
CREATE INDEX IF NOT EXISTS idx_bookings_date_range 
ON public.bookings(room_type_id, check_in, check_out, booking_status);

CREATE INDEX IF NOT EXISTS idx_bookings_room_status 
ON public.bookings(room_type_id, booking_status);

-- Index for rate limiting lookups
CREATE INDEX IF NOT EXISTS idx_rate_limit_cleanup 
ON public.rate_limits(expires_at);

CREATE INDEX IF NOT EXISTS idx_rate_limit_lookup 
ON public.rate_limits(ip_address, endpoint, window_start);

-- Function to cleanup expired rate limits
CREATE OR REPLACE FUNCTION public.cleanup_expired_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM public.rate_limits WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Grant execute permission to service role
GRANT EXECUTE ON FUNCTION public.cleanup_expired_rate_limits() TO service_role;