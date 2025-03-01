/*
  # Fix member deletion columns and function

  1. Changes
    - Add deleted_at column to profiles table
    - Update delete_member function to handle soft deletes properly
    - Add indexes for better query performance
    - Update RLS policies for deleted records

  2. Security
    - Maintain RLS policies
    - Add proper permission checks
    - Handle cascading deletes safely
*/

-- Add deleted_at column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'deleted_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN deleted_at timestamptz;
    CREATE INDEX idx_profiles_deleted_at ON profiles(deleted_at);
  END IF;
END $$;

-- Update delete_member function with proper column handling
CREATE OR REPLACE FUNCTION public.delete_member(member_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_member_name text;
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role_id = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only administrators can delete members' USING ERRCODE = '42501';
  END IF;

  -- Get member name for logging
  SELECT full_name INTO v_member_name
  FROM profiles
  WHERE id = member_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Member not found' USING ERRCODE = '42704';
  END IF;

  -- Begin transaction
  BEGIN
    -- Set instructor_id to NULL in attendance records
    UPDATE attendance 
    SET instructor_id = NULL 
    WHERE instructor_id = member_id;

    -- Set promoted_by to NULL in belt history
    UPDATE belt_history 
    SET promoted_by = NULL 
    WHERE promoted_by = member_id;

    -- Remove user roles
    DELETE FROM user_roles 
    WHERE user_id = member_id;

    -- Remove emergency contacts
    DELETE FROM emergency_contacts 
    WHERE profile_id = member_id;

    -- Remove medical info
    DELETE FROM medical_info 
    WHERE profile_id = member_id;

    -- Remove belt history
    DELETE FROM belt_history 
    WHERE profile_id = member_id;

    -- Remove attendance records
    DELETE FROM attendance 
    WHERE profile_id = member_id;

    -- Soft delete the profile
    UPDATE profiles 
    SET 
      is_deleted = true,
      status = 'deleted',
      updated_at = now(),
      deleted_at = now()
    WHERE id = member_id;

    -- Mark auth user as deleted
    UPDATE auth.users 
    SET raw_app_meta_data = 
      jsonb_set(
        COALESCE(raw_app_meta_data, '{}'::jsonb),
        '{deleted}',
        'true'
      )
    WHERE id = member_id;

    -- Log the deletion
    RAISE NOTICE 'Member % (%) successfully deleted', v_member_name, member_id;

  EXCEPTION
    WHEN OTHERS THEN
      -- Log error details
      RAISE WARNING 'Error deleting member % (%): %', v_member_name, member_id, SQLERRM;
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
  USING (
    deleted_at IS NULL 
    AND NOT COALESCE(is_deleted, false)
  );

-- Update get_members function to handle deleted records
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
    p.deleted_at IS NULL
    AND NOT COALESCE(p.is_deleted, false)
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

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.delete_member(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_members(text, text, text) TO authenticated;