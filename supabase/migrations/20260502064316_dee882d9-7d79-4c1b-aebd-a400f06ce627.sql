-- =========================================================
-- 1. Storage policies for xtsy-gallery-assets bucket
-- =========================================================

-- Public read (bucket is intentionally public for gallery)
DROP POLICY IF EXISTS "xtsy_gallery_public_read" ON storage.objects;
CREATE POLICY "xtsy_gallery_public_read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'xtsy-gallery-assets');

-- Only admin / staff can upload
DROP POLICY IF EXISTS "xtsy_gallery_admin_insert" ON storage.objects;
CREATE POLICY "xtsy_gallery_admin_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'xtsy-gallery-assets'
  AND (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    OR public.has_role(auth.uid(), 'staff'::public.app_role)
  )
);

-- Only admin / staff can update
DROP POLICY IF EXISTS "xtsy_gallery_admin_update" ON storage.objects;
CREATE POLICY "xtsy_gallery_admin_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'xtsy-gallery-assets'
  AND (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    OR public.has_role(auth.uid(), 'staff'::public.app_role)
  )
)
WITH CHECK (
  bucket_id = 'xtsy-gallery-assets'
  AND (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    OR public.has_role(auth.uid(), 'staff'::public.app_role)
  )
);

-- Only admin / staff can delete
DROP POLICY IF EXISTS "xtsy_gallery_admin_delete" ON storage.objects;
CREATE POLICY "xtsy_gallery_admin_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'xtsy-gallery-assets'
  AND (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    OR public.has_role(auth.uid(), 'staff'::public.app_role)
  )
);

-- =========================================================
-- 2. Realtime channel authorization
-- =========================================================

-- Sensitive Realtime topic prefixes restricted to admin/staff only.
-- Other authenticated subscriptions remain allowed.

DROP POLICY IF EXISTS "realtime_sensitive_topic_select" ON realtime.messages;
CREATE POLICY "realtime_sensitive_topic_select"
ON realtime.messages FOR SELECT
TO authenticated
USING (
  CASE
    WHEN realtime.topic() LIKE 'admin_notifications%'
      OR realtime.topic() LIKE 'admin_security_alerts%'
      OR realtime.topic() LIKE 'revenue_intelligence%'
      OR realtime.topic() LIKE 'traveller_profiles%'
      OR realtime.topic() LIKE 'bookings%'
      OR realtime.topic() LIKE 'booking_messages%'
    THEN (
      public.has_role(auth.uid(), 'admin'::public.app_role)
      OR public.has_role(auth.uid(), 'staff'::public.app_role)
    )
    ELSE true
  END
);

DROP POLICY IF EXISTS "realtime_sensitive_topic_insert" ON realtime.messages;
CREATE POLICY "realtime_sensitive_topic_insert"
ON realtime.messages FOR INSERT
TO authenticated
WITH CHECK (
  CASE
    WHEN realtime.topic() LIKE 'admin_notifications%'
      OR realtime.topic() LIKE 'admin_security_alerts%'
      OR realtime.topic() LIKE 'revenue_intelligence%'
      OR realtime.topic() LIKE 'traveller_profiles%'
      OR realtime.topic() LIKE 'bookings%'
      OR realtime.topic() LIKE 'booking_messages%'
    THEN (
      public.has_role(auth.uid(), 'admin'::public.app_role)
      OR public.has_role(auth.uid(), 'staff'::public.app_role)
    )
    ELSE true
  END
);