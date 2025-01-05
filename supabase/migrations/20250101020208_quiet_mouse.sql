-- Drop existing functions to recreate them
DROP FUNCTION IF EXISTS get_members(text, text, text);
DROP FUNCTION IF EXISTS create_member(uuid, text, text, integer, text);
DROP FUNCTION IF EXISTS update_member(uuid, text, text);
DROP FUNCTION IF EXISTS update_member_belt(uuid, text, integer, uuid, text);

-- Create get_members function
CREATE OR REPLACE FUNCTION get_members(
  status_filter text DEFAULT NULL,
  belt_filter text DEFAULT NULL,
  name_search text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  full_name text,
  email text,
  belt text,
  stripes integer,
  status text,
  created_at timestamptz,
  updated_at timestamptz,
  roles text[]
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    u.email::text,
    p.belt,
    p.stripes,
    p.status,
    p.created_at,
    p.updated_at,
    array_agg(DISTINCT ur.role_id) FILTER (WHERE ur.role_id IS NOT NULL) as roles
  FROM profiles p
  LEFT JOIN auth.users u ON p.id = u.id
  LEFT JOIN user_roles ur ON p.id = ur.user_id
  WHERE 
    (status_filter IS NULL OR p.status = status_filter) AND
    (belt_filter IS NULL OR p.belt = belt_filter) AND
    (name_search IS NULL OR p.full_name ILIKE '%' || name_search || '%')
  GROUP BY 
    p.id, 
    p.full_name,
    u.email,
    p.belt, 
    p.stripes, 
    p.status, 
    p.created_at, 
    p.updated_at;
END;
$$;

-- Create create_member function
CREATE OR REPLACE FUNCTION create_member(
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
  -- Generate new UUID
  v_id := gen_random_uuid();

  -- Insert profile
  INSERT INTO profiles (
    id,
    full_name,
    belt,
    stripes,
    status
  ) VALUES (
    v_id,
    p_full_name,
    p_belt,
    p_stripes,
    p_status
  );

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

-- Create update_member function
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

-- Create update_member_belt function
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

  IF NOT p_belt = ANY(ARRAY['white', 'blue', 'purple', 'brown', 'black']) THEN
    RAISE EXCEPTION 'Invalid belt color';
  END IF;

  -- Update profile
  UPDATE profiles
  SET
    belt = p_belt,
    stripes = p_stripes,
    updated_at = now()
  WHERE id = p_id;

  -- Record promotion in belt history
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
    COALESCE(p_notes, 'Belt promotion')
  );
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_members(text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION create_member(text, text, integer, text) TO authenticated;
GRANT EXECUTE ON FUNCTION update_member(uuid, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION update_member_belt(uuid, text, integer, uuid, text) TO authenticated;