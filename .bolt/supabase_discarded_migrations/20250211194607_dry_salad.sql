-- Drop existing policies
DROP POLICY IF EXISTS "Allow profile management" ON public.profiles;
DROP POLICY IF EXISTS "Allow admin role management" ON public.user_roles;
DROP POLICY IF EXISTS "Allow member role self-assignment" ON public.user_roles;

-- Create new policies for profiles
CREATE POLICY "Allow profile management"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (
    -- Users can view all profiles
    true
  )
  WITH CHECK (
    -- Users can create/update their own profile OR admins can manage all profiles
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = 'admin'
    )
  );

-- Create new policies for user_roles
CREATE POLICY "Allow role management"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (
    -- Users can view their own roles OR admins can view all roles
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = 'admin'
    )
  )
  WITH CHECK (
    -- Allow admins to manage roles OR users to assign themselves member role
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = 'admin'
    ) OR
    (auth.uid() = user_id AND role_id = 'member')
  );

-- Create function to ensure new users get member role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role_id)
  VALUES (NEW.id, 'member')
  ON CONFLICT (user_id, role_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user role assignment
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_role ON public.user_roles(user_id, role_id);