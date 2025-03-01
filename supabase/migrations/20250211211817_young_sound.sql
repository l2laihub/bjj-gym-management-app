/*
  # Fix profiles table and get_members function

  1. Changes
    - Add is_deleted column to profiles table
    - Update get_members function to handle soft deletes
    - Add index for better query performance
*/

-- Add is_deleted column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_deleted boolean DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_profiles_is_deleted ON profiles(is_deleted);

-- Drop existing function first
DROP FUNCTION IF EXISTS public.get_members(text, text, text);

-- Recreate function with proper handling of soft deletes
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
    COALESCE(array_agg(DISTINCT ur.role_id) FILTER (WHERE ur.role_id IS NOT NULL), ARRAY[]::text[]) as roles
  FROM profiles p
  LEFT JOIN user_roles ur ON p.id = ur.user_id
  WHERE 
    COALESCE(p.is_deleted, false) = false
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