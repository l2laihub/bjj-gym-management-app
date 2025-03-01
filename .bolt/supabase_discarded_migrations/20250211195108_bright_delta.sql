-- First, drop existing policies that are causing recursion
DROP POLICY IF EXISTS "Allow role management" ON public.user_roles;
DROP POLICY IF EXISTS "Allow profile management" ON public.profiles;

-- Create a more efficient admin check function
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  -- Direct query without using RLS to prevent recursion
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = $1
    AND role_id = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create new policies for user_roles
CREATE POLICY "View own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (
    -- Users can view their own roles
    auth.uid() = user_id
  );

CREATE POLICY "Admin view all roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (
    -- Admins can view all roles
    is_admin(auth.uid())
  );

CREATE POLICY "Admin manage roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (
    -- Admins can manage all roles
    is_admin(auth.uid())
  )
  WITH CHECK (
    -- Admins can manage all roles
    is_admin(auth.uid())
  );

CREATE POLICY "Self assign member role"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Users can only assign themselves the member role
    auth.uid() = user_id AND
    role_id = 'member'
  );

-- Create new policies for profiles
CREATE POLICY "View all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Manage own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin manage profiles"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Ensure proper indexes exist
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON public.user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);