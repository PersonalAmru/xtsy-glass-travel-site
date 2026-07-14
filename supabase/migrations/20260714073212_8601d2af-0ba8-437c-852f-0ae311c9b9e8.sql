-- 1. booking_confirmations: switch from spoofable JWT email match to verified user_id ownership
DROP POLICY IF EXISTS "Users can view their booking confirmations" ON public.booking_confirmations;
CREATE POLICY "Users can view their booking confirmations"
ON public.booking_confirmations
FOR SELECT
TO authenticated
USING (
  booking_id IN (
    SELECT b.id FROM public.bookings b
    WHERE b.user_id = auth.uid()
  )
);

-- 2. push_subscriptions: convert user_id to uuid and enforce strict auth.uid() ownership
DROP POLICY IF EXISTS "push_subscriptions owner manage" ON public.push_subscriptions;
ALTER TABLE public.push_subscriptions
  ALTER COLUMN user_id TYPE uuid USING NULLIF(user_id, '')::uuid;
ALTER TABLE public.push_subscriptions
  ALTER COLUMN user_id SET NOT NULL;
CREATE POLICY "push_subscriptions owner manage"
ON public.push_subscriptions
FOR ALL
TO authenticated
USING (user_id = auth.uid() OR is_admin())
WITH CHECK (user_id = auth.uid() OR is_admin());

-- 3. storage.objects: add admin-only policies for the other private buckets
-- xtsyvoyage
CREATE POLICY "xtsyvoyage bucket admin read"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'xtsyvoyage' AND is_admin());
CREATE POLICY "xtsyvoyage bucket admin insert"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'xtsyvoyage' AND is_admin());
CREATE POLICY "xtsyvoyage bucket admin update"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'xtsyvoyage' AND is_admin())
WITH CHECK (bucket_id = 'xtsyvoyage' AND is_admin());
CREATE POLICY "xtsyvoyage bucket admin delete"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'xtsyvoyage' AND is_admin());

-- xtsy-270
CREATE POLICY "xtsy-270 bucket admin read"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'xtsy-270' AND is_admin());
CREATE POLICY "xtsy-270 bucket admin insert"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'xtsy-270' AND is_admin());
CREATE POLICY "xtsy-270 bucket admin update"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'xtsy-270' AND is_admin())
WITH CHECK (bucket_id = 'xtsy-270' AND is_admin());
CREATE POLICY "xtsy-270 bucket admin delete"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'xtsy-270' AND is_admin());

-- xtsy-adventure-campsite
CREATE POLICY "xtsy-adventure-campsite bucket admin read"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'xtsy-adventure-campsite' AND is_admin());
CREATE POLICY "xtsy-adventure-campsite bucket admin insert"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'xtsy-adventure-campsite' AND is_admin());
CREATE POLICY "xtsy-adventure-campsite bucket admin update"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'xtsy-adventure-campsite' AND is_admin())
WITH CHECK (bucket_id = 'xtsy-adventure-campsite' AND is_admin());
CREATE POLICY "xtsy-adventure-campsite bucket admin delete"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'xtsy-adventure-campsite' AND is_admin());