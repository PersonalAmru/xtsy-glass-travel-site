-- =====================================================
-- XTSY MULTI-TENANT ARCHITECTURE - Part 3
-- Add RLS policies for new tables
-- =====================================================

-- 1) RLS Policies for franchise_assignments
CREATE POLICY "Admin full access to franchise_assignments"
  ON public.franchise_assignments FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Franchise can view own assignments"
  ON public.franchise_assignments FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 2) RLS Policies for franchise_invites
CREATE POLICY "Admin full access to franchise_invites"
  ON public.franchise_invites FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3) RLS Policies for property_wallets
CREATE POLICY "Admin full access to wallets"
  ON public.property_wallets FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Franchise can view their property wallets"
  ON public.property_wallets FOR SELECT
  TO authenticated
  USING (property_id IN (SELECT public.get_user_properties(auth.uid())));

-- 4) RLS Policies for settlements
CREATE POLICY "Admin full access to settlements"
  ON public.settlements FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Franchise can view their settlements"
  ON public.settlements FOR SELECT
  TO authenticated
  USING (property_id IN (SELECT public.get_user_properties(auth.uid())));

-- 5) Create function to auto-assign franchise role when invited user signs up
CREATE OR REPLACE FUNCTION public.process_franchise_invite()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  invite_record RECORD;
BEGIN
  SELECT * INTO invite_record
  FROM public.franchise_invites
  WHERE email = NEW.email
    AND is_used = false
    AND expires_at > now()
  LIMIT 1;

  IF FOUND THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'franchise')
    ON CONFLICT (user_id, role) DO NOTHING;

    INSERT INTO public.franchise_assignments (user_id, property_id, assigned_by)
    VALUES (NEW.id, invite_record.property_id, invite_record.invited_by);

    UPDATE public.franchise_invites
    SET is_used = true, accepted_at = now()
    WHERE id = invite_record.id;
  END IF;

  RETURN NEW;
END;
$$;

-- 6) Create trigger for franchise invite processing
DROP TRIGGER IF EXISTS on_auth_user_created_process_franchise_invite ON auth.users;
CREATE TRIGGER on_auth_user_created_process_franchise_invite
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.process_franchise_invite();