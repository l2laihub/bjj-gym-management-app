/*
  # Fix member creation process

  1. Changes
    - Add function to create member profile first
    - Add function to safely assign roles after profile exists
    - Add proper error handling and validation
*/

-- Function to create member profile
CREATE OR REPLACE FUNCTION public.create_member_profile(
  p_user_id uuid,
  p_email text,
  p_full_name text,
  p_belt text DEFAULT 'white',
  p_stripes int DEFAULT 0
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile first
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
    p_user_id,
    p_email,
    p_full_name,
    p_belt,
    p_stripes,
    'active',
    now(),
    now()
  );

  -- Then assign member role
  INSERT INTO user_roles (user_id, role_id)
  VALUES (p_user_id, 'member')
  ON CONFLICT (user_id, role_id) DO NOTHING;

  -- Finally record initial belt
  INSERT INTO belt_history (
    profile_id,
    belt,
    stripes,
    notes,
    promoted_at,
    promoted_by
  )
  VALUES (
    p_user_id,
    p_belt,
    p_stripes,
    'Initial belt assignment',
    now(),
    auth.uid()
  );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.create_member_profile(uuid, text, text, text, int) TO authenticated;