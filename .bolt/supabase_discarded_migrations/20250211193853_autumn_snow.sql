-- Drop existing policies
DROP POLICY IF EXISTS "Allow profile creation" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow member role assignment during signup" ON public.user_roles;

-- Create new policies for profiles
CREATE POLICY "Allow profile creation and management"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (
    -- Users can view all profiles
    true
  )
  WITH CHECK (
    -- Allow admins to manage all profiles
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = 'admin'
    )
  );

-- Create new policy for user_roles
CREATE POLICY "Allow role management"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (
    -- Users can view their own roles
    user_id = auth.uid() OR
    -- Admins can view all roles
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = 'admin'
    )
  )
  WITH CHECK (
    -- Admins can manage roles
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = 'admin'
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_role 
  ON public.user_roles(user_id, role_id);