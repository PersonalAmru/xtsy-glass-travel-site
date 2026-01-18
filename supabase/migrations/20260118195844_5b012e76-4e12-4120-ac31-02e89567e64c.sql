-- ============================================================
-- Security Fix: Restrict booking_invoices and whatsapp_templates access
-- Issues: PUBLIC_DATA_EXPOSURE, MISSING_RLS
-- ============================================================

-- 1. FIX: booking_invoices - Remove overly permissive SELECT policy
-- Drop existing permissive policies
DROP POLICY IF EXISTS "Invoices read for all" ON public.booking_invoices;
DROP POLICY IF EXISTS "Anyone can read invoices" ON public.booking_invoices;
DROP POLICY IF EXISTS "Allow invoice creation" ON public.booking_invoices;
DROP POLICY IF EXISTS "Anyone can create invoices" ON public.booking_invoices;

-- Create proper scoped policies for booking_invoices
-- Guests can view their own invoices (matched by email in JWT or booking user_id)
CREATE POLICY "Guests view own invoices" ON public.booking_invoices
  FOR SELECT 
  USING (
    -- Match by email from JWT claims
    guest_email = (current_setting('request.jwt.claims', true)::json->>'email')
    OR
    -- Match by user_id through bookings table
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE bookings.booking_id = booking_invoices.booking_id 
      AND bookings.user_id = auth.uid()
    )
    OR
    -- Admins can view all invoices
    public.has_role(auth.uid(), 'admin')
  );

-- Only service role or admins can create invoices
CREATE POLICY "Admins can create invoices" ON public.booking_invoices
  FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'admin')
    OR auth.jwt() ->> 'role' = 'service_role'
  );

-- Only admins can update invoices
CREATE POLICY "Admins can update invoices" ON public.booking_invoices
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete invoices
CREATE POLICY "Admins can delete invoices" ON public.booking_invoices
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- 2. FIX: whatsapp_templates - Restrict to admin only
-- Drop existing permissive policy
DROP POLICY IF EXISTS "Authenticated users can update templates" ON public.whatsapp_templates;

-- Create admin-only update policy
CREATE POLICY "Admins can update templates" ON public.whatsapp_templates
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Also restrict INSERT and DELETE to admins
DROP POLICY IF EXISTS "Authenticated users can insert templates" ON public.whatsapp_templates;
DROP POLICY IF EXISTS "Authenticated users can delete templates" ON public.whatsapp_templates;

CREATE POLICY "Admins can insert templates" ON public.whatsapp_templates
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete templates" ON public.whatsapp_templates
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Keep public read access for templates (needed for frontend to fetch template content)
-- This is safe as templates don't contain sensitive data