
-- Allow users with the 'admin' role to view all donations
CREATE POLICY "Admin can select all donations" ON public.donations
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
