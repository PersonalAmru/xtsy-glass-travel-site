-- Fix SUPA_security_definer_view: reviews_public ran with the view owner's
-- privileges (security definer semantics), bypassing RLS of the querying user.
-- Flip it to invoker rights and grant a narrow, column-safe public read path
-- on the base table so behavior is preserved (public columns stay readable).

ALTER VIEW public.reviews_public SET (security_invoker = true, security_barrier = true);

-- View grants: read-only (previously anon/authenticated held full write privileges on the view)
REVOKE ALL ON public.reviews_public FROM anon, authenticated;
GRANT SELECT ON public.reviews_public TO anon, authenticated;
GRANT SELECT ON public.reviews_public TO service_role;

-- Base table: anon may read only the public-safe columns (excludes booking_id)
GRANT SELECT (id, guest_name, rating, review_text, photos, verified, created_at, property_id) ON public.reviews TO anon;
-- Authenticated (incl. admin/staff UIs) may read all columns; rows still governed by RLS
GRANT SELECT ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;

-- Public read policy matching the view's previous exposure (all rows, safe columns)
DROP POLICY IF EXISTS reviews_public_read ON public.reviews;
CREATE POLICY reviews_public_read ON public.reviews
  FOR SELECT TO anon, authenticated
  USING (true);