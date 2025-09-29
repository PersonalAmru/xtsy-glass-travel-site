-- Add room availability status management for admin dashboard control

-- Create room_availability_status table for admin-controlled availability
CREATE TABLE IF NOT EXISTS public.room_availability_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_type_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available', -- 'available', 'soldout', 'maintenance'
  admin_note TEXT,
  override_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.room_availability_status ENABLE ROW LEVEL SECURITY;

-- Create policies for room availability status
CREATE POLICY "room_availability_status_public_read"
ON public.room_availability_status FOR SELECT
USING (true);

CREATE POLICY "room_availability_status_admin_full_access"
ON public.room_availability_status FOR ALL
USING (is_admin_or_staff() OR auth.role() = 'service_role')
WITH CHECK (is_admin_or_staff() OR auth.role() = 'service_role');

-- Create unique index to prevent duplicate room status entries
CREATE UNIQUE INDEX IF NOT EXISTS idx_room_availability_status_room_type 
ON public.room_availability_status(room_type_id);

-- Add function to get current room availability status
CREATE OR REPLACE FUNCTION public.get_room_availability_status(p_room_type_id TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  status_result TEXT;
  override_until_val TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get the current status and override time
  SELECT status, override_until INTO status_result, override_until_val
  FROM public.room_availability_status
  WHERE room_type_id = p_room_type_id;
  
  -- If no status found, default to available
  IF status_result IS NULL THEN
    RETURN 'available';
  END IF;
  
  -- Check if override has expired
  IF override_until_val IS NOT NULL AND override_until_val < NOW() THEN
    -- Override expired, reset to available
    UPDATE public.room_availability_status
    SET status = 'available', override_until = NULL, updated_at = NOW()
    WHERE room_type_id = p_room_type_id;
    
    RETURN 'available';
  END IF;
  
  RETURN status_result;
END;
$$;