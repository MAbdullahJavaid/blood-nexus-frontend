
-- Assign the "admin" role to the specified user in the user_roles table
INSERT INTO public.user_roles (user_id, role)
VALUES ('fa5947a0-ed65-494c-8daa-fc6294ff1d11', 'admin')
ON CONFLICT DO NOTHING;
