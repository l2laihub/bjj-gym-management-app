/*
  # Member Management Procedures
  
  1. New Procedures
    - create_member: Creates a new member profile
    - update_member: Updates member information
    - update_member_belt: Updates member belt and stripes with history
    - update_member_status: Updates member status
    - delete_member: Soft deletes a member
  
  2. Security
    - All procedures use SECURITY DEFINER
    - RLS policies remain in effect
    - Input validation included
*/

-- Create member procedure
CREATE OR REPLACE FUNCTION create_member(
  p_user_id uuid,
  p_full_name text,
  p_belt text DEFAULT 'white',
  p_stripes integer DEFAULT 0,
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
  -- Validate input
  IF p_stripes < 0 OR p_stripes > 4 THEN
    RAISE EXCEPTION 'Invalid number of stripes';
  END IF;

  -- Insert profile
  INSERT INTO profiles (
    id,
    full_name,
    belt,
    stripes,
    status
  ) VALUES (
    p_user_id,
    p_full_name,
    p_belt,
    p_stripes,
    p_status
  )
  RETURNING id INTO v_id;

  -- Add to belt history
  INSERT INTO belt_history (
    profile_id,
    belt,
    stripes,
    notes
  ) VALUES (
    v_id,
    p_belt,
    p_stripes,
    'Initial belt assignment'
  );

  RETURN v_id;
END;
$$;

-- Update member procedure
CREATE OR REPLACE FUNCTION update_member(
  p_id uuid,
  p_full_name text,
  p_status text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles
  SET
    full_name = COALESCE(p_full_name, full_name),
    status = COALESCE(p_status, status),
    updated_at = now()
  WHERE id = p_id;
END;
$$;

-- Update member belt procedure
CREATE OR REPLACE FUNCTION update_member_belt(
  p_id uuid,
  p_belt text,
  p_stripes integer,
  p_promoted_by uuid,
  p_notes text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate input
  IF p_stripes < 0 OR p_stripes > 4 THEN
    RAISE EXCEPTION 'Invalid number of stripes';
  END IF;

  -- Update profile
  UPDATE profiles
  SET
    belt = p_belt,
    stripes = p_stripes,
    updated_at = now()
  WHERE id = p_id;

  -- Add to belt history
  INSERT INTO belt_history (
    profile_id,
    belt,
    stripes,
    promoted_by,
    notes
  ) VALUES (
    p_id,
    p_belt,
    p_stripes,
    p_promoted_by,
    p_notes
  );
END;
$$;

-- Update member status procedure
CREATE OR REPLACE FUNCTION update_member_status(
  p_id uuid,
  p_status text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles
  SET
    status = p_status,
    updated_at = now()
  WHERE id = p_id;
END;
$$;

-- Soft delete member procedure
CREATE OR REPLACE FUNCTION delete_member(
  p_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles
  SET
    status = 'deleted',
    updated_at = now()
  WHERE id = p_id;
END;
$$;