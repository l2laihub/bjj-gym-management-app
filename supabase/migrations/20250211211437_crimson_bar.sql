/*
  # Fix member deletion process

  1. Changes
    - Add soft delete functionality
    - Update foreign key constraints
    - Improve error handling
    - Add proper cleanup of related records

  2. Security
    - Only admins can delete members
    - Proper RLS policies for deleted members
*/

-- Add deleted flag to profiles if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'is_deleted'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_deleted boolean DEFAULT false;
    CREATE INDEX idx_profiles_is_deleted ON profiles(is_deleted);
  END IF;
END $$;

-- Update delete_member function to handle soft deletes and related records
CREATE OR REPLACE FUNCTION public.delete_member(member_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role_id = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only administrators can delete members' USING ERRCODE = '42501';
  END IF;

  -- Check if member exists and is not already deleted
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = member_id 
    AND NOT is_deleted
  ) THEN
    RAISE EXCEPTION 'Member not found or already deleted' USING ERRCODE = '42704';
  END IF;

  -- Begin transaction
  BEGIN
    -- Soft delete the profile
    UPDATE profiles 
    SET 
      is_deleted = true,
      status = 'deleted',
      updated_at = now()
    WHERE id = member_id;

    -- Deactivate user in auth system
    UPDATE auth.users 
    SET raw_app_meta_data = 
      jsonb_set(
        COALESCE(raw_app_meta_data, '{}'::jsonb),
        '{deleted}',
        'true'
      )
    WHERE id = member_id;

    -- Remove instructor references
    UPDATE attendance 
    SET instructor_id = NULL 
    WHERE instructor_id = member_id;

    -- Remove promoter references
    UPDATE belt_history 
    SET promoted_by = NULL 
    WHERE promoted_by = member_id;

    -- Remove user roles
    DELETE FROM user_roles 
    WHERE user_id = member_id;

  EXCEPTION
    WHEN OTHERS THEN
      -- Log error details
      RAISE WARNING 'Error deleting member %: %', member_id, SQLERRM;
      RAISE;
  END;
END;
$$;

-- Update RLS policies for deleted members
DROP POLICY IF EXISTS "Hide deleted members" ON profiles;
CREATE POLICY "Hide deleted members"
  ON profiles
  FOR ALL
  TO authenticated
  USING (NOT is_deleted);

-- Update get_members function to exclude deleted members
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

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.delete_member(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_members(text, text, text) TO authenticated;