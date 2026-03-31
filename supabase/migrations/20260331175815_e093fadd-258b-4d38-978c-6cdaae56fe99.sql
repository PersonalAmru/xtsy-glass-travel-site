-- Tours CMS table for marketplace
CREATE TABLE public.tours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  short_description text,
  duration text NOT NULL,
  difficulty text NOT NULL DEFAULT 'Moderate',
  price integer NOT NULL,
  original_price integer,
  currency text DEFAULT 'INR',
  images text[] DEFAULT '{}',
  rating numeric(2,1) DEFAULT 4.5,
  review_count integer DEFAULT 0,
  category text NOT NULL DEFAULT 'adventure',
  location text NOT NULL,
  region text,
  highlights text[] DEFAULT '{}',
  best_season text,
  exclusive boolean DEFAULT false,
  international boolean DEFAULT false,
  group_size text,
  visa_info text,
  itinerary jsonb DEFAULT '[]',
  inclusions text[] DEFAULT '{}',
  exclusions text[] DEFAULT '{}',
  faqs jsonb DEFAULT '[]',
  locations_covered text[] DEFAULT '{}',
  is_published boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published tours"
  ON public.tours FOR SELECT
  USING (is_published = true);

CREATE INDEX idx_tours_slug ON public.tours(slug);
CREATE INDEX idx_tours_location ON public.tours(location);
CREATE INDEX idx_tours_category ON public.tours(category);
CREATE INDEX idx_tours_is_published ON public.tours(is_published);