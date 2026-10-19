-- =============================================================
-- SECURITY DEFINER functions run as their owner, and the migration role
-- `sandbox_exec` has no USAGE on schema `auth` (the platform owns that
-- schema and does not let new roles be added to it), so every function
-- sandbox_exec owns died at its first auth.uid() call with
--   42501: permission denied for schema auth
-- That blocked guest enquiries (create_enquiry) and every admin/staff
-- identity check (has_role -> get_user_role / is_admin / is_admin_or_staff),
-- which the enquiries read policy also depends on.
--
-- `postgres` already has auth USAGE and is the owner of the enquiry
-- function that does work (create_whatsapp_enquiry), so these five are
-- handed to it. Only the two tables these functions actually write need
-- an extra grant: postgres could already SELECT and INSERT into
-- invoice_counter but not bump the counter row.
-- =============================================================
GRANT UPDATE ON public.invoice_counter TO postgres;

ALTER FUNCTION public.create_enquiry(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, INTEGER, INTEGER,
  NUMERIC, NUMERIC, NUMERIC, NUMERIC, NUMERIC,
  TEXT, TEXT, TEXT, TEXT, TEXT, UUID
) OWNER TO postgres;

ALTER FUNCTION public.has_role(UUID, public.app_role) OWNER TO postgres;
ALTER FUNCTION public.get_user_role() OWNER TO postgres;
ALTER FUNCTION public.is_admin() OWNER TO postgres;
ALTER FUNCTION public.is_admin_or_staff() OWNER TO postgres;