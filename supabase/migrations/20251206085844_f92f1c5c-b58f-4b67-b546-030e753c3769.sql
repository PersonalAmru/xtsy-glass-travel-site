-- Add admin role to the existing user
INSERT INTO public.user_roles (user_id, role)
VALUES ('d4053fb2-7dad-449c-9a52-1ec4a89e2150', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;