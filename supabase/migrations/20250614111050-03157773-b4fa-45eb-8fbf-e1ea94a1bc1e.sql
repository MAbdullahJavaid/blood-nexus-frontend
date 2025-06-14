
-- Step 1: Create the enum for application roles
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('lab', 'bds', 'reception');
  END IF;
END
$$;

-- Step 2: Create user_roles table to assign roles to users
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Step 3: Enable RLS and set up security policies
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Allow users to view, create and remove only their own roles
CREATE POLICY "Users can read their roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own roles"
  ON public.user_roles FOR DELETE
  USING (auth.uid() = user_id);

-- (Optional) Allow only admins to update roles. For now, block user-initiated updates.
CREATE POLICY "Nobody can update roles"
  ON public.user_roles FOR UPDATE
  USING (false);

-- Step 4: Helper function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;
