-- Fix Function Search Path Security Warning
BEGIN;

-- Update ip_anonymize function with secure search path
CREATE OR REPLACE FUNCTION public.ip_anonymize(ip_text text)
RETURNS text 
LANGUAGE sql 
IMMUTABLE 
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT CASE 
    WHEN ip_text IS NULL THEN NULL
    WHEN ip_text ~* '^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$' THEN
      -- IPv4: mask last octet
      regexp_replace(ip_text, '\.[0-9]+$', '.***')
    WHEN ip_text ~* '^[0-9a-f:]+$' THEN  
      -- IPv6: mask last 64 bits
      regexp_replace(ip_text, ':([0-9a-f]+:){0,3}[0-9a-f]+$', ':***:***:***:***')
    ELSE 'masked'
  END;
$$;

COMMIT;