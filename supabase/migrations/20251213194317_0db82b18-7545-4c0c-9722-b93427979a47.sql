-- Add admin role for xtsy.social@gmail.com
-- This will run after the user logs in for the first time via OTP

-- Create a function to automatically assign admin role to the specified email
CREATE OR REPLACE FUNCTION public.auto_assign_admin_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if this is the admin email
  IF NEW.email = 'xtsy.social@gmail.com' THEN
    -- Insert admin role if not exists
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to auto-assign admin role on user creation
DROP TRIGGER IF EXISTS on_auth_user_created_assign_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_assign_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_assign_admin_role();

-- Also try to insert now in case the user already exists
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Get user_id for the admin email
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'xtsy.social@gmail.com'
  LIMIT 1;
  
  -- If user exists, add admin role
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RAISE NOTICE 'Admin role added for existing user';
  ELSE
    RAISE NOTICE 'User not found - admin role will be assigned on first login';
  END IF;
END $$;