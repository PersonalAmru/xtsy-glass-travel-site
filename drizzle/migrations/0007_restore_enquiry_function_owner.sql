-- public.create_enquiry is SECURITY DEFINER, so it runs as its owner.
-- It was last created by the migration role `sandbox_exec`, which has no USAGE on
-- schema `auth`, so every call died with `42501: permission denied for schema auth`
-- as soon as it reached `v_user_id := auth.uid();` -- no guest enquiry was ever
-- stored through it (TAB Bistro table requests, campsite bookings and the contact
-- form all use this function).
--
-- `public.create_whatsapp_enquiry`, the room-enquiry function that does work, is
-- owned by `postgres`, which has auth USAGE. Re-owning create_enquiry to the same
-- role restores it without widening privileges: EXECUTE grants to
-- anon/authenticated/service_role are unchanged and search_path stays pinned to
-- `public`.
ALTER FUNCTION public.create_enquiry(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, INTEGER, INTEGER,
  NUMERIC, NUMERIC, NUMERIC, NUMERIC, NUMERIC,
  TEXT, TEXT, TEXT, TEXT, TEXT, UUID
) OWNER TO postgres;