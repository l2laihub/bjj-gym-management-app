-- Drop existing functions to recreate them
DROP FUNCTION IF EXISTS update_member_belt(uuid, text, integer, uuid, text);
DROP FUNCTION IF EXISTS get_members(text, text, text);

-- Recreate get_members function with proper error handling
CREATE OR REPLACE FUNCTION get_members(
  status_filter text DEFAULT NULL,
  belt_filter text DEFAULT NULL,
  name_search text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  full_name text,
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
    p.belt,
    p.stripes,
    p.status,
    p.created_at,
    p.updated_at,
    array_agg(DISTINCT ur.role_id) as roles
  FROM profiles p
  LEFT JOIN user_roles ur ON p.id = ur.user_id
  WHERE 
    (status_filter IS NULL OR p.status = status_filter) AND
    (belt_filter IS NULL OR p.belt = belt_filter) AND
    (name_search IS NULL OR p.full_name ILIKE '%' || name_search || '%')
  GROUP BY p.id, p.full_name, p.belt, p.stripes, p.status, p.created_at, p.updated_at;
END;
$$;

-- Recreate update_member_belt function with proper validation
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
GRANT EXECUTE ON FUNCTION update_member_belt(uuid, text, integer, uuid, text) TO authenticated;