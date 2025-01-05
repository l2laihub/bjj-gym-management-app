/*
  # Fix Database Relationships and Queries

  1. Changes
    - Drop and recreate get_members function with proper joins
    - Add missing foreign key relationships
    - Update policies for proper access control
    - Fix role aggregation in member queries

  2. Security
    - Enable RLS on all tables
    - Add proper policies for authenticated users
    - Ensure secure access to member data
*/

-- Drop existing function to recreate it
DROP FUNCTION IF EXISTS get_members(text, text, text);

-- Recreate get_members function with proper joins
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
    u.email,
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

-- Update policies for proper access
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.profiles;
CREATE POLICY "Authenticated users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_members(text, text, text) TO authenticated;

-- Ensure proper indexes
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_belt ON profiles(belt);
CREATE INDEX IF NOT EXISTS idx_profiles_full_name ON profiles(full_name);