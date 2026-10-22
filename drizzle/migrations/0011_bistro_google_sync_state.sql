CREATE TABLE public.bistro_google_sync_state (
 id boolean PRIMARY KEY DEFAULT true CHECK (id),
 callback_token text NOT NULL,
 synced_payload text,
 lease_until timestamptz,
 last_checked_at timestamptz,
 last_synced_at timestamptz,
 last_error text
);
REVOKE ALL ON public.bistro_google_sync_state FROM anon, authenticated;
GRANT ALL ON public.bistro_google_sync_state TO service_role;
ALTER TABLE public.bistro_google_sync_state ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.claim_bistro_google_sync() RETURNS boolean LANGUAGE sql SECURITY INVOKER SET search_path = '' AS $$
 UPDATE public.bistro_google_sync_state SET lease_until = now() + interval '5 minutes', last_checked_at = now() WHERE id AND (lease_until IS NULL OR lease_until < now()) RETURNING true;
$$;
REVOKE ALL ON FUNCTION public.claim_bistro_google_sync() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_bistro_google_sync() TO service_role;