-- Fix remaining RLS policy issues for backup tables
-- Add proper policies for backup tables that were missing them

-- Add RLS policies for booking_confirmations_backup
CREATE POLICY "Service role can manage booking confirmations backup" 
ON public.booking_confirmations_backup 
FOR ALL 
USING (auth.role() = 'service_role'::text)
WITH CHECK (auth.role() = 'service_role'::text);

CREATE POLICY "Admins can view booking confirmations backup" 
ON public.booking_confirmations_backup 
FOR SELECT 
USING (is_admin());

-- Add RLS policies for booking_rate_limits_backup  
CREATE POLICY "Service role can manage rate limits backup" 
ON public.booking_rate_limits_backup 
FOR ALL 
USING (auth.role() = 'service_role'::text)
WITH CHECK (auth.role() = 'service_role'::text);

CREATE POLICY "Admins can view rate limits backup" 
ON public.booking_rate_limits_backup 
FOR SELECT 
USING (is_admin());

-- Add last_login field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;