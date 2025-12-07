-- Create the missing blocked_dates table for secure-blocking edge function
CREATE TABLE public.blocked_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_type text NOT NULL,
  date date NOT NULL,
  blocked boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(room_type, date)
);

-- Enable Row Level Security
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;

-- Public can read blocked dates (needed for availability calendar)
CREATE POLICY "blocked_dates_public_read" ON public.blocked_dates
  FOR SELECT USING (true);

-- Only admins/staff can manage blocked dates
CREATE POLICY "blocked_dates_admin_manage" ON public.blocked_dates
  FOR ALL USING (
    (get_user_role() = ANY (ARRAY['admin'::text, 'staff'::text])) 
    OR (auth.role() = 'service_role'::text)
  )
  WITH CHECK (
    (get_user_role() = ANY (ARRAY['admin'::text, 'staff'::text])) 
    OR (auth.role() = 'service_role'::text)
  );

-- Deny public write access
CREATE POLICY "blocked_dates_deny_insert_public" ON public.blocked_dates
  FOR INSERT WITH CHECK (false);

CREATE POLICY "blocked_dates_deny_update_public" ON public.blocked_dates
  FOR UPDATE USING (false);

CREATE POLICY "blocked_dates_deny_delete_public" ON public.blocked_dates
  FOR DELETE USING (false);