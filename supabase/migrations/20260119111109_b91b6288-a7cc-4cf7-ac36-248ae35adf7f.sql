-- Add admin role for amru@xtsy.one user
INSERT INTO user_roles (user_id, role)
VALUES ('7bd5bcc5-1a82-46e4-baa6-6a53fa10701c', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;