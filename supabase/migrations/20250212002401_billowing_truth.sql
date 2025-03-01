-- Remove the foreign key constraint from profiles table
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Add a new unique constraint on email
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_email_unique;
ALTER TABLE profiles ADD CONSTRAINT profiles_email_unique UNIQUE (email);

-- Update RLS policies to use profile ID instead of auth.uid()
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Hide deleted members" ON profiles;

-- Create new policies
CREATE POLICY "Admins can manage all profiles"
  ON profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = 'admin'
    )
  );

CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = 'admin'
    )
  );

-- Update create_member_profile function
CREATE OR REPLACE FUNCTION public.create_member_profile(
  p_email text,
  p_full_name text,
  p_belt text DEFAULT 'white',
  p_stripes int DEFAULT 0,
  p_status text DEFAULT 'active'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role_id = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only administrators can create members' USING ERRCODE = '42501';
  END IF;

  -- Check if email already exists
  IF EXISTS (
    SELECT 1 FROM profiles 
    WHERE email = p_email 
    AND NOT COALESCE(is_deleted, false)
  ) THEN
    RAISE EXCEPTION 'A member with this email already exists';
  END IF;

  -- Generate new ID
  v_id := gen_random_uuid();

  -- Create profile
  INSERT INTO profiles (
    id,
    email,
    full_name,
    belt,
    stripes,
    status,
    created_at,
    updated_at
  )
  VALUES (
    v_id,
    p_email,
    p_full_name,
    p_belt,
    p_stripes,
    p_status,
    now(),
    now()
  );

  -- Assign member role
  INSERT INTO user_roles (user_id, role_id)
  VALUES (v_id, 'member');

  -- Record initial belt
  INSERT INTO belt_history (
    profile_id,
    belt,
    stripes,
    notes,
    promoted_at,
    promoted_by
  )
  VALUES (
    v_id,
    p_belt,
    p_stripes,
    'Initial belt assignment',
    now(),
    auth.uid()
  );

  RETURN v_id;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.create_member_profile(text, text, text, int, text) TO authenticated;