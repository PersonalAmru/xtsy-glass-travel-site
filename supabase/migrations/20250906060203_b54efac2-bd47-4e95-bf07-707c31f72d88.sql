-- Fix remaining function search path security warnings
BEGIN;

-- Fix search_path for the remaining functions that don't have it set
ALTER FUNCTION public.is_admin() SET search_path = public;
ALTER FUNCTION public.norm_email(text) SET search_path = public;

COMMIT;