
-- 1. chat_conversations: explicit anon denial (defense in depth)
REVOKE ALL ON public.chat_conversations FROM anon;
CREATE POLICY "Deny anonymous access to chat conversations"
ON public.chat_conversations AS RESTRICTIVE FOR ALL
TO public
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- 2. Email system tables: bind policies to the service_role grantee directly
REVOKE ALL ON public.email_send_log, public.email_send_state, public.suppressed_emails, public.email_unsubscribe_tokens FROM anon, authenticated;
GRANT ALL ON public.email_send_log, public.email_send_state, public.suppressed_emails, public.email_unsubscribe_tokens TO service_role;

DROP POLICY IF EXISTS "Service role can insert send log" ON public.email_send_log;
DROP POLICY IF EXISTS "Service role can read send log" ON public.email_send_log;
DROP POLICY IF EXISTS "Service role can update send log" ON public.email_send_log;
CREATE POLICY "service_role manages send log" ON public.email_send_log AS PERMISSIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can manage send state" ON public.email_send_state;
CREATE POLICY "service_role manages send state" ON public.email_send_state AS PERMISSIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can insert suppressed emails" ON public.suppressed_emails;
DROP POLICY IF EXISTS "Service role can read suppressed emails" ON public.suppressed_emails;
CREATE POLICY "service_role manages suppressed emails" ON public.suppressed_emails AS PERMISSIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can insert tokens" ON public.email_unsubscribe_tokens;
DROP POLICY IF EXISTS "Service role can read tokens" ON public.email_unsubscribe_tokens;
DROP POLICY IF EXISTS "Service role can mark tokens as used" ON public.email_unsubscribe_tokens;
CREATE POLICY "service_role manages unsubscribe tokens" ON public.email_unsubscribe_tokens AS PERMISSIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 3. user_location_preferences: validate + cap anonymous inserts
CREATE OR REPLACE FUNCTION public.location_prefs_insert_allowed()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (SELECT count(*) FROM public.user_location_preferences
          WHERE created_at > now() - interval '1 hour') < 100;
$$;

REVOKE ALL ON FUNCTION public.location_prefs_insert_allowed() FROM public;
GRANT EXECUTE ON FUNCTION public.location_prefs_insert_allowed() TO anon, authenticated, service_role;

DROP POLICY IF EXISTS "Allow anonymous location detection inserts" ON public.user_location_preferences;
CREATE POLICY "Validated anonymous location inserts"
ON public.user_location_preferences FOR INSERT
TO anon, authenticated
WITH CHECK (
  country_code ~ '^[A-Za-z]{2}$'
  AND detected_currency ~ '^[A-Za-z]{3}$'
  AND (detected_at IS NULL OR detected_at BETWEEN now() - interval '1 day' AND now() + interval '5 minutes')
  AND public.location_prefs_insert_allowed()
);
