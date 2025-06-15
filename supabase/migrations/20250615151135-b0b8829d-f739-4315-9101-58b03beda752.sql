
-- Allow users with role 'admin' to view all donations
-- Make sure your 'profiles' table has a 'role' field, set to 'admin' for admin users

CREATE POLICY "Admins can view all donations"
  ON public.donations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
    OR user_id = auth.uid()
  );
