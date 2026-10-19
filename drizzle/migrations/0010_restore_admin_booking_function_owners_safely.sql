-- Repair only admin/booking routines and their booking trigger dependencies.
-- Keep caller identity, validation, prices and function signatures unchanged.
-- OTP values are backend-only; unguarded admin mutations get a caller-bound gate.
DO $repair$
DECLARE
  fn record;
  definition text;
  admin_guard text := E'\n  IF NOT (COALESCE(public.is_admin_or_staff(), false) OR COALESCE(auth.role() = ''service_role'', false)) THEN\n    RAISE EXCEPTION ''Admin privileges required'' USING ERRCODE = ''42501'';\n  END IF;\n';
BEGIN
  FOR fn IN
    SELECT p.oid, p.proname, p.oid::regprocedure AS signature
    FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    JOIN pg_roles r ON r.oid = p.proowner
    WHERE n.nspname = 'public' AND r.rolname = 'sandbox_exec'
      AND p.proname = ANY (ARRAY[
        'admin_block_room_date_secure','admin_get_booking_pii','admin_search_bookings',
        'approve_booking_and_block_inventory','approve_enquiry',
        'assign_booking_user_id','assign_booking_user_id_secure',
        'check_suspicious_booking_activity','create_booking_secure','create_booking_with_invoice',
        'deny_booking_with_message','detect_suspicious_booking_access',
        'generate_booking_id','generate_invoice_number','generate_password_reset_otp','verify_password_reset_otp',
        'get_analytics_overview','get_app_secret','get_app_secret_secure',
        'get_booking_calendar','get_bookings_masked_secure','get_jwt_email','get_masked_booking_data',
        'get_my_booking_pii','get_my_bookings','get_newsletter_stats_admin_secure',
        'get_newsletter_stats_secure','get_newsletter_subscriber_details_admin',
        'get_room_availability_status','get_secret_access_log_masked_secure','get_security_alerts_masked_secure',
        'get_single_booking_secure','get_transaction_details_admin','get_transactions_admin_view_secure',
        'get_user_bookings_secure','get_user_properties','is_franchise_for_property',
        'log_admin_booking_access','log_booking_access','log_booking_access_attempt','log_pii_access',
        'log_secure_access','log_sensitive_data_access','mark_booking_no_show',
        'notify_new_message','prevent_role_escalation','record_settlement_transition',
        'resolve_room_type_id','resolve_security_alert_admin','sanitize_and_validate_booking_data',
        'set_booking_id','transactions_admin_secure','update_inventory_on_booking',
        'validate_booking_data','validate_booking_data_fixed','validate_secure_booking_creation',
        'verify_booking_access','verify_booking_owner_only'
      ])
    ORDER BY p.proname, p.oid
  LOOP
    IF fn.proname = ANY (ARRAY['approve_booking_and_block_inventory','approve_enquiry','deny_booking_with_message','mark_booking_no_show','record_settlement_transition','get_booking_calendar']) THEN
      definition := pg_get_functiondef(fn.oid);
      definition := regexp_replace(definition, E'\\mBEGIN\\M', 'BEGIN' || admin_guard, 'i');
      IF fn.proname IN ('approve_booking_and_block_inventory','approve_enquiry','deny_booking_with_message','mark_booking_no_show') THEN
        definition := replace(definition, admin_guard, admin_guard || E'\n  IF COALESCE(auth.role(), '''') <> ''service_role'' AND p_admin_id IS DISTINCT FROM auth.uid() THEN\n    RAISE EXCEPTION ''Admin identity must match the signed-in caller'' USING ERRCODE = ''42501'';\n  END IF;\n');
      END IF;
      IF fn.proname = 'record_settlement_transition' THEN
        definition := replace(definition, admin_guard, admin_guard || E'\n  IF COALESCE(auth.role(), '''') <> ''service_role'' AND p_actor_id IS DISTINCT FROM auth.uid() THEN\n    RAISE EXCEPTION ''Actor identity must match the signed-in caller'' USING ERRCODE = ''42501'';\n  END IF;\n');
        definition := replace(definition,
          '(SELECT ''admin'' FROM public.profiles WHERE id = p_actor_id AND role IN (''admin'', ''staff''))',
          '(SELECT ''admin'' WHERE public.has_role(p_actor_id, ''admin''::public.app_role) OR public.has_role(p_actor_id, ''staff''::public.app_role))');
      END IF;
      EXECUTE definition;
    END IF;
    IF fn.proname = 'get_app_secret' THEN
      definition := pg_get_functiondef(fn.oid);
      definition := replace(definition, 'IF current_user_role != ''admin'' AND auth.role() != ''service_role'' THEN',
        'IF COALESCE(current_user_role, '''') <> ''admin'' AND COALESCE(auth.role(), '''') <> ''service_role'' THEN');
      EXECUTE definition;
    END IF;
    IF fn.proname = 'prevent_role_escalation' THEN
      definition := pg_get_functiondef(fn.oid);
      definition := replace(definition,
        E'SELECT EXISTS (\n      SELECT 1 FROM public.profiles p\n      WHERE p.id = auth.uid() AND p.role::TEXT = ''admin''\n    ) INTO is_admin_user;',
        'SELECT public.has_role(auth.uid(), ''admin''::public.app_role) INTO is_admin_user;');
      EXECUTE definition;
    END IF;
    EXECUTE format('ALTER FUNCTION %s OWNER TO postgres', fn.signature);
  END LOOP;
END;
$repair$;

-- Only the privileged owner gains the missing write permissions; no guest grants change.
GRANT UPDATE ON public.bookings, public.enquiries, public.blocked_dates,
  public.room_inventory, public.booking_invoices, public.invoices,
  public.booking_rate_limits, public.password_reset_otp, public.inventory,
  public.invoice_counter, public.security_alerts, public.admin_notifications,
  public.admin_security_alerts TO postgres;

-- The server emails OTPs; exposing the return value to guests would defeat verification.
REVOKE EXECUTE ON FUNCTION public.generate_password_reset_otp(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.verify_password_reset_otp(text,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.generate_password_reset_otp(text), public.verify_password_reset_otp(text,text) TO service_role;

-- Unguarded mutations are no longer anonymously executable, and retain internal role checks.
REVOKE EXECUTE ON FUNCTION public.approve_booking_and_block_inventory(uuid,uuid),
  public.approve_enquiry(uuid,uuid), public.deny_booking_with_message(uuid,uuid,text),
  public.mark_booking_no_show(uuid,uuid),
  public.record_settlement_transition(uuid,text,text,numeric,text,uuid),
  public.get_booking_calendar(date,date) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.approve_booking_and_block_inventory(uuid,uuid),
  public.approve_enquiry(uuid,uuid), public.deny_booking_with_message(uuid,uuid,text),
  public.mark_booking_no_show(uuid,uuid),
  public.record_settlement_transition(uuid,text,text,numeric,text,uuid),
  public.get_booking_calendar(date,date) TO authenticated, service_role;
