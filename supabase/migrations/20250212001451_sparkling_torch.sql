-- Create simplified function to create member profile
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