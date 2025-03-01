-- Create function to get members with roles
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
    array_agg(ur.role_id) as roles
  FROM profiles p
  LEFT JOIN user_roles ur ON p.id = ur.user_id
  WHERE 
    (status_filter IS NULL OR p.status = status_filter) AND
    (belt_filter IS NULL OR p.belt = belt_filter) AND
    (name_search IS NULL OR p.full_name ILIKE '%' || name_search || '%')
  GROUP BY p.id;
END;
$$;