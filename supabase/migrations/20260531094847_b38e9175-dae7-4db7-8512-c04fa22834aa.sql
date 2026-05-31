-- 1. Catering enquiries: explicit admin/staff read policy (PII protection)
CREATE POLICY "Admin staff can view catering enquiries"
ON public.catering_enquiries
FOR SELECT
TO authenticated
USING (is_admin_or_staff());

-- 2. dpdp_consents: prevent clients from setting ip_address themselves
DROP POLICY IF EXISTS "Public can insert consents" ON public.dpdp_consents;

CREATE POLICY "Public can insert consents"
ON public.dpdp_consents
FOR INSERT
TO public
WITH CHECK (ip_address IS NULL);