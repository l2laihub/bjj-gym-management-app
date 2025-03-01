/*
  # Add admin functions for user management

  1. New Functions
    - create_member_user: Safely create new member user
    - get_member_by_email: Safely check for existing member
*/

-- Function to check if member exists by email
CREATE OR REPLACE FUNCTION public.get_member_by_email(p_email text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT id INTO v_user_id
  FROM profiles
  WHERE email = p_email;
  
  RETURN v_user_id;
END;
$$;

-- Function to create member user
CREATE OR REPLACE FUNCTION public.create_member_user(
  p_email text,
  p_full_name text,
  p_belt text DEFAULT 'white',
  p_stripes int DEFAULT 0
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Check if user exists
  IF get_member_by_email(p_email) IS NOT NULL THEN
    RAISE EXCEPTION 'Member with email % already exists', p_email;
  END IF;

  -- Create profile
  INSERT INTO profiles (
    id,
    email,
    full_name,
    belt,
    stripes,
    status
  )
  VALUES (
    auth.uid(),
    p_email,
    p_full_name,
    p_belt,
    p_stripes,
    'active'
  )
  RETURNING id INTO v_user_id;

  -- Assign member role
  INSERT INTO user_roles (user_id, role_id)
  VALUES (v_user_id, 'member')
  ON CONFLICT (user_id, role_id) DO NOTHING;

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
    v_user_id,
    p_belt,
    p_stripes,
    'Initial belt assignment',
    now(),
    auth.uid()
  );

  RETURN v_user_id;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_member_by_email(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_member_user(text, text, text, int) TO authenticated;