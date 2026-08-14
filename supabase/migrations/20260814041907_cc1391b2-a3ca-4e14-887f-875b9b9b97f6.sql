CREATE TABLE public.tour_pricing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  region TEXT,
  duration TEXT,
  price_per_person INTEGER NOT NULL CHECK (price_per_person >= 0),
  compare_at_price INTEGER CHECK (compare_at_price >= 0),
  competitor_name TEXT,
  competitor_price INTEGER CHECK (competitor_price >= 0),
  min_group INTEGER CHECK (min_group > 0),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.tour_pricing TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tour_pricing TO authenticated;
GRANT ALL ON public.tour_pricing TO service_role;

ALTER TABLE public.tour_pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active tour pricing"
  ON public.tour_pricing FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins and staff can view all tour pricing"
  ON public.tour_pricing FOR SELECT
  TO authenticated
  USING (public.is_admin_or_staff());

CREATE POLICY "Admins and staff can insert tour pricing"
  ON public.tour_pricing FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_staff());

CREATE POLICY "Admins and staff can update tour pricing"
  ON public.tour_pricing FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_staff())
  WITH CHECK (public.is_admin_or_staff());

CREATE POLICY "Admins and staff can delete tour pricing"
  ON public.tour_pricing FOR DELETE
  TO authenticated
  USING (public.is_admin_or_staff());

CREATE TRIGGER update_tour_pricing_updated_at
  BEFORE UPDATE ON public.tour_pricing
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_tour_pricing_slug ON public.tour_pricing (slug);