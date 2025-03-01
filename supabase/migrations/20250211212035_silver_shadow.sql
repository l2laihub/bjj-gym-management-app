/*
  # Fix member deletion cascade and references

  1. Changes
    - Add ON DELETE SET NULL for instructor references
    - Update delete_member function to handle references properly
    - Add proper error handling and validation
    - Improve soft delete functionality

  2. Security
    - Maintain RLS policies
    - Add proper permission checks
    - Handle cascading deletes safely
*/

-- Update attendance table foreign key constraints
ALTER TABLE attendance 
  DROP CONSTRAINT IF EXISTS attendance_instructor_id_fkey,
  ADD CONSTRAINT attendance_instructor_id_fkey 
    FOREIGN KEY (instructor_id) 
    REFERENCES profiles(id) 
    ON DELETE SET NULL;

-- Update delete_member function with proper error handling
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

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.delete_member(uuid) TO authenticated;