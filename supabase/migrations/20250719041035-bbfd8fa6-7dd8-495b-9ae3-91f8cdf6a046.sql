-- Create destinations table for travel locations
CREATE TABLE public.destinations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create itineraries table for travel plans
CREATE TABLE public.itineraries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  duration_days INTEGER NOT NULL,
  destinations JSONB NOT NULL DEFAULT '[]',
  activities JSONB NOT NULL DEFAULT '[]',
  estimated_cost INTEGER,
  difficulty_level TEXT,
  best_season TEXT,
  image_url TEXT,
  tags TEXT[],
  featured BOOLEAN DEFAULT false,
  source TEXT DEFAULT 'internal',
  external_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attractions table for points of interest
CREATE TABLE public.attractions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  destination_id UUID REFERENCES public.destinations(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  address TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  image_url TEXT,
  google_place_id TEXT,
  opening_hours JSONB,
  entry_fee INTEGER,
  rating NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat conversations table for AI assistant
CREATE TABLE public.chat_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_email TEXT,
  messages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reviews table for user feedback
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id),
  guest_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  photos TEXT[],
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for destinations
CREATE POLICY "Destinations are viewable by everyone" 
ON public.destinations 
FOR SELECT 
USING (true);

CREATE POLICY "Only service role can manage destinations" 
ON public.destinations 
FOR ALL 
TO service_role
USING (true) 
WITH CHECK (true);

-- Create RLS policies for itineraries
CREATE POLICY "Itineraries are viewable by everyone" 
ON public.itineraries 
FOR SELECT 
USING (true);

CREATE POLICY "Only service role can manage itineraries" 
ON public.itineraries 
FOR ALL 
TO service_role
USING (true) 
WITH CHECK (true);

-- Create RLS policies for attractions
CREATE POLICY "Attractions are viewable by everyone" 
ON public.attractions 
FOR SELECT 
USING (true);

CREATE POLICY "Only service role can manage attractions" 
ON public.attractions 
FOR ALL 
TO service_role
USING (true) 
WITH CHECK (true);

-- Create RLS policies for chat conversations
CREATE POLICY "Users can view their own conversations" 
ON public.chat_conversations 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create conversations" 
ON public.chat_conversations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own conversations" 
ON public.chat_conversations 
FOR UPDATE 
USING (true);

CREATE POLICY "Service role can manage all conversations" 
ON public.chat_conversations 
FOR ALL 
TO service_role
USING (true) 
WITH CHECK (true);

-- Create RLS policies for reviews
CREATE POLICY "Reviews are viewable by everyone" 
ON public.reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Guests can create reviews for their bookings" 
ON public.reviews 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Service role can manage all reviews" 
ON public.reviews 
FOR ALL 
TO service_role
USING (true) 
WITH CHECK (true);

-- Insert sample destinations data
INSERT INTO public.destinations (name, state, description, image_url, latitude, longitude, featured) VALUES
('Shillong', 'Meghalaya', 'The Scotland of the East, known for its pleasant climate and beautiful landscapes', '/lovable-uploads/6a7b3dad-87a3-49d9-98fa-919ff7b09dd0.png', 25.5788, 91.8933, true),
('Cherrapunji', 'Meghalaya', 'Famous for being one of the wettest places on Earth with stunning waterfalls', '/lovable-uploads/29371033-4f1b-4455-882e-ecaa3758aa7b.png', 25.3000, 91.7000, true),
('Mawlynnong', 'Meghalaya', 'Asia''s cleanest village with living root bridges', '/lovable-uploads/3fb3e606-6b14-409a-b0ef-87fd12dbac22.png', 25.2630, 91.8820, false),
('Guwahati', 'Assam', 'Gateway to Northeast India with rich cultural heritage', '/lovable-uploads/70b7c61f-c52c-479b-9663-3957d72f31b0.png', 26.1445, 91.7362, true),
('Kaziranga', 'Assam', 'National Park famous for one-horned rhinoceros', '/lovable-uploads/db863c94-a5db-4aa4-afa6-e11364e4b9d7.png', 26.5775, 93.1713, true),
('Majuli', 'Assam', 'World''s largest river island with unique culture', '/lovable-uploads/0ef988f7-b7f3-4d1f-80e3-fc2a04acd9cb.png', 27.0230, 94.2036, false);

-- Insert sample itineraries
INSERT INTO public.itineraries (title, description, duration_days, destinations, activities, estimated_cost, difficulty_level, best_season, featured) VALUES
('Meghalaya Explorer', 'Discover the hidden gems of Meghalaya including living root bridges and waterfalls', 7, 
'[{"name": "Shillong", "days": 2}, {"name": "Cherrapunji", "days": 3}, {"name": "Mawlynnong", "days": 2}]',
'[{"day": 1, "activity": "Arrive in Shillong, explore local markets"}, {"day": 2, "activity": "Visit Elephant Falls and Shillong Peak"}, {"day": 3, "activity": "Travel to Cherrapunji"}, {"day": 4, "activity": "Explore living root bridges"}, {"day": 5, "activity": "Visit Nohkalikai Falls"}, {"day": 6, "activity": "Experience Mawlynnong village"}, {"day": 7, "activity": "Return journey"}]',
25000, 'Moderate', 'October to April', true),

('Assam Wildlife & Culture', 'Experience the rich wildlife and cultural heritage of Assam', 6,
'[{"name": "Guwahati", "days": 2}, {"name": "Kaziranga", "days": 2}, {"name": "Majuli", "days": 2}]',
'[{"day": 1, "activity": "Arrive in Guwahati, visit Kamakhya Temple"}, {"day": 2, "activity": "Explore Assam State Museum"}, {"day": 3, "activity": "Safari at Kaziranga National Park"}, {"day": 4, "activity": "Jeep safari and bird watching"}, {"day": 5, "activity": "Ferry to Majuli Island"}, {"day": 6, "activity": "Explore Satras and return"}]',
22000, 'Easy', 'November to March', true);

-- Insert sample attractions
INSERT INTO public.attractions (destination_id, name, type, description, latitude, longitude, entry_fee, rating) 
SELECT 
  d.id,
  a.name,
  a.type,
  a.description,
  a.latitude,
  a.longitude,
  a.entry_fee,
  a.rating
FROM public.destinations d
CROSS JOIN (VALUES
  ('Shillong', 'Elephant Falls', 'Waterfall', 'Beautiful three-tiered waterfall near Shillong', 25.5260, 91.8854, 10, 4.2),
  ('Shillong', 'Shillong Peak', 'Viewpoint', 'Highest point in Shillong offering panoramic views', 25.5900, 91.8800, 5, 4.0),
  ('Cherrapunji', 'Nohkalikai Falls', 'Waterfall', 'Tallest plunge waterfall in India', 25.2958, 91.6970, 0, 4.8),
  ('Cherrapunji', 'Living Root Bridge', 'Natural Wonder', 'Double-decker living root bridge', 25.2500, 91.7200, 20, 4.9),
  ('Guwahati', 'Kamakhya Temple', 'Temple', 'Famous Hindu temple dedicated to Goddess Kamakhya', 26.1665, 91.7040, 0, 4.5),
  ('Kaziranga', 'Kaziranga National Park', 'National Park', 'UNESCO World Heritage Site for one-horned rhinoceros', 26.5775, 93.1713, 250, 4.7)
) AS a(dest_name, name, type, description, latitude, longitude, entry_fee, rating)
WHERE d.name = a.dest_name;