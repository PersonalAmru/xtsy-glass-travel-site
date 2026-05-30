-- =========================================================
-- TAB Bistro: public restaurant reviews + catering enquiries
-- =========================================================

-- 1) Restaurant reviews (public submissions, admin-approved for display)
CREATE TABLE public.restaurant_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_name TEXT NOT NULL,
  rating INTEGER NOT NULL,
  review_text TEXT,
  photos TEXT[],
  visit_type TEXT,
  price_range TEXT,
  source TEXT NOT NULL DEFAULT 'Direct',
  owner_reply TEXT,
  local_guide BOOLEAN NOT NULL DEFAULT false,
  verified BOOLEAN NOT NULL DEFAULT false,
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT restaurant_reviews_rating_range CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT restaurant_reviews_name_len CHECK (char_length(guest_name) BETWEEN 1 AND 120),
  CONSTRAINT restaurant_reviews_text_len CHECK (review_text IS NULL OR char_length(review_text) <= 2000)
);

GRANT SELECT, INSERT ON public.restaurant_reviews TO anon;
GRANT SELECT, INSERT ON public.restaurant_reviews TO authenticated;
GRANT ALL ON public.restaurant_reviews TO service_role;

ALTER TABLE public.restaurant_reviews ENABLE ROW LEVEL SECURITY;

-- Public can only read approved reviews
CREATE POLICY "restaurant_reviews_read_approved"
ON public.restaurant_reviews
FOR SELECT
TO anon, authenticated
USING (approved = true);

-- Public can submit a review, but never self-approve or self-reply
CREATE POLICY "restaurant_reviews_public_insert"
ON public.restaurant_reviews
FOR INSERT
TO anon, authenticated
WITH CHECK (
  approved = false
  AND owner_reply IS NULL
  AND verified = false
  AND rating BETWEEN 1 AND 5
);

-- Service role manages everything (admin moderation)
CREATE POLICY "restaurant_reviews_service_manage"
ON public.restaurant_reviews
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE INDEX idx_restaurant_reviews_approved_created
ON public.restaurant_reviews (approved, created_at DESC);

-- 2) Catering / bulk-order enquiries
CREATE TABLE public.catering_enquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  event_type TEXT NOT NULL,
  event_date DATE,
  guest_count INTEGER,
  cuisine_preferences TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT catering_name_len CHECK (char_length(full_name) BETWEEN 1 AND 120),
  CONSTRAINT catering_phone_len CHECK (char_length(phone) BETWEEN 5 AND 20),
  CONSTRAINT catering_message_len CHECK (message IS NULL OR char_length(message) <= 2000)
);

-- anon/authenticated may only submit (no public read of leads)
GRANT INSERT ON public.catering_enquiries TO anon;
GRANT INSERT ON public.catering_enquiries TO authenticated;
GRANT ALL ON public.catering_enquiries TO service_role;

ALTER TABLE public.catering_enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "catering_enquiries_public_insert"
ON public.catering_enquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (
  status = 'new'
  AND char_length(full_name) BETWEEN 1 AND 120
);

CREATE POLICY "catering_enquiries_service_manage"
ON public.catering_enquiries
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 3) Public storage bucket for review photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('review-media', 'review-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "review_media_public_read"
ON storage.objects
FOR SELECT
USING (bucket_id = 'review-media');

CREATE POLICY "review_media_public_upload"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'review-media');