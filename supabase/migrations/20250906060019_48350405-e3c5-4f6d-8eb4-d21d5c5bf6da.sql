-- Fix function search path security warnings
BEGIN;

-- Fix search_path for functions that don't have it set
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.increment_happy_guests() SET search_path = public;

COMMIT;