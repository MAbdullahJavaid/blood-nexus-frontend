
-- Create user management tables and enhance existing ones

-- Add additional columns to profiles table for better user management
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
ADD COLUMN IF NOT EXISTS last_login timestamp with time zone,
ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id);

-- Create user_management_logs table for audit trail
CREATE TABLE IF NOT EXISTS public.user_management_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid REFERENCES auth.users(id) NOT NULL,
  target_user_id uuid REFERENCES auth.users(id) NOT NULL,
  action text NOT NULL CHECK (action IN ('created', 'updated', 'deleted', 'role_added', 'role_removed', 'status_changed')),
  details jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on user_management_logs
ALTER TABLE public.user_management_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view all user management logs
CREATE POLICY "Admins can view all user management logs" ON public.user_management_logs
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create policy for admins to insert user management logs
CREATE POLICY "Admins can insert user management logs" ON public.user_management_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create function to get user profile with roles
CREATE OR REPLACE FUNCTION public.get_user_with_roles(user_uuid uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_profile jsonb;
  user_roles jsonb;
BEGIN
  -- Get user profile
  SELECT to_jsonb(p.*) INTO user_profile
  FROM public.profiles p
  WHERE p.id = user_uuid;
  
  -- Get user roles
  SELECT jsonb_agg(ur.role) INTO user_roles
  FROM public.user_roles ur
  WHERE ur.user_id = user_uuid;
  
  -- Combine profile and roles
  IF user_profile IS NOT NULL THEN
    user_profile := user_profile || jsonb_build_object('roles', COALESCE(user_roles, '[]'::jsonb));
  END IF;
  
  RETURN user_profile;
END;
$$;

-- Create function to check if user can manage other users
CREATE OR REPLACE FUNCTION public.can_manage_users(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT public.has_role(user_uuid, 'admin');
$$;

-- Update profiles table policies for admin access
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create new policies that allow admins to manage all profiles
CREATE POLICY "Users can view own profile or admins can view all" ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own profile or admins can update all" ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert profiles" ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete profiles" ON public.profiles
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Update user_roles policies for admin management
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

CREATE POLICY "Users can view own roles or admins can view all" ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert user roles" ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update user roles" ON public.user_roles
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete user roles" ON public.user_roles
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create function to log user management actions
CREATE OR REPLACE FUNCTION public.log_user_management_action(
  admin_id uuid,
  target_id uuid,
  action_type text,
  action_details jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_management_logs (admin_user_id, target_user_id, action, details)
  VALUES (admin_id, target_id, action_type, action_details);
END;
$$;
