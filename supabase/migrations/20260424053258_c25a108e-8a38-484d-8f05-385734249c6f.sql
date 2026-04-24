-- Fix 1: admin_notifications - restrict SELECT to admins/staff only
DROP POLICY IF EXISTS "Notifications read for all" ON public.admin_notifications;
DROP POLICY IF EXISTS "Admins can read notifications" ON public.admin_notifications;

CREATE POLICY "Admins can read notifications"
ON public.admin_notifications
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role)
  OR public.has_role(auth.uid(), 'staff'::app_role)
);

-- Fix 2: consent_records - restrict UPDATE to matching visitor_id only
DROP POLICY IF EXISTS "Allow anonymous updates for consent" ON public.consent_records;

CREATE POLICY "Visitors can update their own consent"
ON public.consent_records
FOR UPDATE
TO anon, authenticated
USING (
  visitor_id = current_setting('request.headers', true)::json->>'x-visitor-id'
)
WITH CHECK (
  visitor_id = current_setting('request.headers', true)::json->>'x-visitor-id'
);