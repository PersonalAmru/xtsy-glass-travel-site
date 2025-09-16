-- Fix newsletter stats security: Restrict access to admin users only
-- Remove public read access and add proper RLS policies

-- Enable Row Level Security on newsletter_stats table
ALTER TABLE public.newsletter_stats ENABLE ROW LEVEL SECURITY;

-- Create policy to allow only admin users to view newsletter statistics
CREATE POLICY "newsletter_stats_admin_select_only" 
ON public.newsletter_stats 
FOR SELECT 
USING (is_admin());

-- Create policy to allow service role full access for system operations
CREATE POLICY "newsletter_stats_service_role_manage" 
ON public.newsletter_stats 
FOR ALL 
USING (auth.role() = 'service_role') 
WITH CHECK (auth.role() = 'service_role');

-- Deny all other operations for public users
CREATE POLICY "newsletter_stats_deny_insert_public" 
ON public.newsletter_stats 
FOR INSERT 
WITH CHECK (false);

CREATE POLICY "newsletter_stats_deny_update_public" 
ON public.newsletter_stats 
FOR UPDATE 
USING (false);

CREATE POLICY "newsletter_stats_deny_delete_public" 
ON public.newsletter_stats 
FOR DELETE 
USING (false);