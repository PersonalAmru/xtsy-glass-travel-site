-- =============================================================
-- Root cause of "42501: permission denied for schema auth".
--
-- SECURITY DEFINER functions run as their owner. The migration role
-- `sandbox_exec` owns most of them (create_enquiry, get_user_role,
-- is_admin, is_admin_or_staff, create_booking_secure,
-- verify_booking_access, generate_password_reset_otp, the admin_*
-- helpers ...) and every one of them calls auth.uid() / auth.role().
-- sandbox_exec had no USAGE on schema `auth`, so each call died at the
-- first auth.* reference -- which is why guest enquiries were never
-- stored and admin role checks could not run at all.
--
-- USAGE on the schema is the narrow fix: it allows calling the auth
-- helper functions (each still guarded by its own EXECUTE grant) and
-- grants no table privilege in `auth`.
--
-- create_enquiry is then handed back to sandbox_exec, the owner of the
-- tables it writes (enquiries, invoice_counter), so it needs no extra
-- table grant of its own.
-- =============================================================
GRANT USAGE ON SCHEMA auth TO sandbox_exec;

ALTER FUNCTION public.create_enquiry(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, INTEGER, INTEGER,
  NUMERIC, NUMERIC, NUMERIC, NUMERIC, NUMERIC,
  TEXT, TEXT, TEXT, TEXT, TEXT, UUID
) OWNER TO sandbox_exec;