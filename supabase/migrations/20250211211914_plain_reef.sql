/*
  # Add email column to profiles table

  1. Changes
    - Add email column to profiles table
    - Add unique constraint on email
    - Update get_members function to handle email field properly
*/

-- Add email column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'email'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email text;
    ALTER TABLE profiles ADD CONSTRAINT profiles_email_unique UNIQUE (email);
  END IF;
END $$;

-- Drop existing function first
DROP FUNCTION IF EXISTS public.get_members(text, text, text);

-- Recreate function with proper email handling
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
    COALESCE(p.email, ''),
    p.full_name,
    COALESCE(p.belt, 'white'),
    COALESCE(p.stripes, 0),
    COALESCE(p.status, 'active'),
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
      OR COALESCE(p.email, '') ILIKE '%' || name_search || '%'
    )
  GROUP BY p.id;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_members(text, text, text) TO authenticated;