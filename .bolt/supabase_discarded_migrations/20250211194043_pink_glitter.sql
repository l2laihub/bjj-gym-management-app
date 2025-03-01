-- Drop existing policies
DROP POLICY IF EXISTS "Allow profile creation and management" ON public.profiles;
DROP POLICY IF EXISTS "Allow role management" ON public.user_roles;

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
CREATE POLICY "Allow admin role management"
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
    -- Allow admins to manage roles
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = 'admin'
    )
  );

CREATE POLICY "Allow member role self-assignment"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Allow users to assign themselves the member role during signup
    auth.uid() = user_id AND
    role_id = 'member'
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_role ON public.user_roles(user_id, role_id);