-- Fix RLS policies for blocked_dates table to allow anonymous reads
-- Drop existing policies first
DROP POLICY IF EXISTS "blocked_dates_admin_access" ON public.blocked_dates;
DROP POLICY IF EXISTS "blocked_dates_public_read" ON public.blocked_dates;

-- Create new policies with proper access control
CREATE POLICY "Allow read access to all"
  ON public.blocked_dates
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can write"
  ON public.blocked_dates
  FOR INSERT
  WITH CHECK (is_admin_or_staff());

CREATE POLICY "Only admins can update"
  ON public.blocked_dates
  FOR UPDATE
  USING (is_admin_or_staff())
  WITH CHECK (is_admin_or_staff());

CREATE POLICY "Only admins can delete"
  ON public.blocked_dates
  FOR DELETE
  USING (is_admin_or_staff());