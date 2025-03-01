/*
  # Fix get_members function type mismatch

  1. Changes
    - Fix email type mismatch between auth.users and function return type
    - Ensure proper type casting for email field
    - Add proper NULL handling for email field

  2. Security
    - Maintain existing security policies
    - Keep RLS enabled
*/

-- Drop existing function to recreate it
DROP FUNCTION IF EXISTS get_members(text, text, text);

-- Recreate get_members function with proper type handling
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
    COALESCE(u.email::text, ''),  -- Cast email to text and handle NULL
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

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_members(text, text, text) TO authenticated;