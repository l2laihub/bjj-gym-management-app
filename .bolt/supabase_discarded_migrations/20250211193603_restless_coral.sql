-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Create new policies for user_roles table
CREATE POLICY "Allow member role assignment during signup"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    role_id = 'member' AND
    (
      -- Allow users to assign themselves the member role
      auth.uid() = user_id OR
      -- Allow admins to assign roles to others
      EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
        AND ur.role_id = 'admin'
      )
    )
  );

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = 'admin'
    )
  );

-- Update profiles policies to ensure proper access
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

CREATE POLICY "Allow profile creation"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Allow users to create their own profile
    auth.uid() = id OR
    -- Allow admins to create profiles for others
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = 'admin'
    )
  );

CREATE POLICY "Admins can manage all profiles"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = 'admin'
    )
  );

-- Update belt_history policies
DROP POLICY IF EXISTS "Users can view own belt history" ON public.belt_history;
DROP POLICY IF EXISTS "Admins can manage belt history" ON public.belt_history;

CREATE POLICY "Allow belt history creation"
  ON public.belt_history
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Allow admins to create belt history
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = 'admin'
    )
  );

CREATE POLICY "Users can view own belt history"
  ON public.belt_history
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = profile_id OR
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = 'admin'
    )
  );

CREATE POLICY "Admins can manage belt history"
  ON public.belt_history
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = 'admin'
    )
  );