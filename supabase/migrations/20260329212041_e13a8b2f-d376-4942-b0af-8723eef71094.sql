
-- Tour enquiries table for tour package bookings
CREATE TABLE public.tour_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id TEXT NOT NULL UNIQUE,
  package_title TEXT NOT NULL,
  package_duration TEXT NOT NULL,
  package_difficulty TEXT NOT NULL,
  package_category TEXT NOT NULL,
  package_location TEXT NOT NULL,
  travellers INTEGER NOT NULL DEFAULT 1,
  preferred_date TEXT NOT NULL,
  group_type TEXT NOT NULL DEFAULT 'solo',
  per_person_price NUMERIC NOT NULL,
  total_amount NUMERIC NOT NULL,
  guest_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  city TEXT,
  special_requests TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  approved_by UUID,
  rejected_at TIMESTAMPTZ,
  rejected_by UUID,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tour_enquiries ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (public booking form)
CREATE POLICY "Allow anonymous tour enquiry inserts"
  ON public.tour_enquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to read their own enquiries
CREATE POLICY "Users can read own tour enquiries"
  ON public.tour_enquiries
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Allow admins to read all (using has_role function if exists, otherwise service role)
CREATE POLICY "Service role full access to tour enquiries"
  ON public.tour_enquiries
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_tour_enquiries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tour_enquiries_updated_at
  BEFORE UPDATE ON public.tour_enquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_tour_enquiries_updated_at();
