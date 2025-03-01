/*
  # Fix database errors and permissions

  1. Changes
    - Fix ambiguous column references in RLS policies
    - Add function to check admin role
    - Update user roles constraints
    - Add function to safely get profile
*/

-- Create admin check function
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = $1
    AND ur.role_id = 'admin'
  );
$$;

-- Create function to safely get profile
CREATE OR REPLACE FUNCTION public.get_profile(profile_id uuid)
RETURNS SETOF profiles
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.* FROM profiles p
  WHERE p.id = profile_id
  AND (
    auth.uid() = profile_id
    OR is_admin(auth.uid())
  );
$$;

-- Update user_roles constraints and indexes
ALTER TABLE user_roles DROP CONSTRAINT IF EXISTS user_roles_pkey;
ALTER TABLE user_roles ADD PRIMARY KEY (user_id, role_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);

-- Update RLS policies to use explicit table references
DO $$ 
BEGIN
  -- Profiles policies
  DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
  CREATE POLICY "Admins can read all profiles"
    ON profiles
    FOR SELECT
    TO authenticated
    USING (is_admin(auth.uid()));

  DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
  CREATE POLICY "Admins can update all profiles"
    ON profiles
    FOR UPDATE
    TO authenticated
    USING (is_admin(auth.uid()));

  DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;
  CREATE POLICY "Admins can insert profiles"
    ON profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (is_admin(auth.uid()));

  -- User roles policies
  DROP POLICY IF EXISTS "Admins can manage user roles" ON user_roles;
  CREATE POLICY "Admins can manage user roles"
    ON user_roles
    FOR ALL
    TO authenticated
    USING (is_admin(auth.uid()));
END $$;