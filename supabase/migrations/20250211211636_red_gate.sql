/*
  # Fix get_members function

  1. Changes
    - Drop and recreate get_members function with updated return type
    - Maintain existing functionality
    - Improve error handling
*/

-- Drop existing function first
DROP FUNCTION IF EXISTS public.get_members(text, text, text);

-- Recreate function with updated return type
CREATE OR REPLACE FUNCTION public.get_members(
  status_filter text DEFAULT NULL,
  belt_filter text DEFAULT NULL,
  name_search text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  email text,
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
    p.email,
    p.full_name,
    p.belt,
    p.stripes,
    p.status,
    p.created_at,
    p.updated_at,
    array_agg(DISTINCT ur.role_id)::text[] as roles
  FROM profiles p
  LEFT JOIN user_roles ur ON p.id = ur.user_id
  WHERE 
    NOT p.is_deleted
    AND (status_filter IS NULL OR p.status = status_filter)
    AND (belt_filter IS NULL OR p.belt = belt_filter)
    AND (
      name_search IS NULL 
      OR p.full_name ILIKE '%' || name_search || '%'
      OR p.email ILIKE '%' || name_search || '%'
    )
  GROUP BY p.id;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_members(text, text, text) TO authenticated;