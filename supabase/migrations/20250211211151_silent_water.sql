/*
  # Fix member deletion cascade

  1. Changes
    - Add ON DELETE CASCADE to foreign keys
    - Update delete_member function to handle all relations
    - Add soft delete support
*/

-- Add soft delete column to profiles if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'deleted_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN deleted_at timestamptz;
  END IF;
END $$;

-- Update foreign keys to cascade
ALTER TABLE attendance 
  DROP CONSTRAINT IF EXISTS attendance_profile_id_fkey,
  DROP CONSTRAINT IF EXISTS attendance_instructor_id_fkey,
  ADD CONSTRAINT attendance_profile_id_fkey 
    FOREIGN KEY (profile_id) 
    REFERENCES profiles(id) 
    ON DELETE CASCADE,
  ADD CONSTRAINT attendance_instructor_id_fkey 
    FOREIGN KEY (instructor_id) 
    REFERENCES profiles(id) 
    ON DELETE SET NULL;

ALTER TABLE belt_history 
  DROP CONSTRAINT IF EXISTS belt_history_profile_id_fkey,
  DROP CONSTRAINT IF EXISTS belt_history_promoted_by_fkey,
  ADD CONSTRAINT belt_history_profile_id_fkey 
    FOREIGN KEY (profile_id) 
    REFERENCES profiles(id) 
    ON DELETE CASCADE,
  ADD CONSTRAINT belt_history_promoted_by_fkey 
    FOREIGN KEY (promoted_by) 
    REFERENCES profiles(id) 
    ON DELETE SET NULL;

ALTER TABLE emergency_contacts 
  DROP CONSTRAINT IF EXISTS emergency_contacts_profile_id_fkey,
  ADD CONSTRAINT emergency_contacts_profile_id_fkey 
    FOREIGN KEY (profile_id) 
    REFERENCES profiles(id) 
    ON DELETE CASCADE;

ALTER TABLE medical_info 
  DROP CONSTRAINT IF EXISTS medical_info_profile_id_fkey,
  ADD CONSTRAINT medical_info_profile_id_fkey 
    FOREIGN KEY (profile_id) 
    REFERENCES profiles(id) 
    ON DELETE CASCADE;

ALTER TABLE user_roles 
  DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey,
  ADD CONSTRAINT user_roles_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES profiles(id) 
    ON DELETE CASCADE;

-- Update delete_member function to handle soft deletes
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
    RAISE EXCEPTION 'Only administrators can delete members';
  END IF;

  -- Soft delete the profile
  UPDATE profiles 
  SET 
    status = 'deleted',
    deleted_at = now(),
    updated_at = now()
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

  -- Set instructor_id to NULL in attendance records
  UPDATE attendance 
  SET instructor_id = NULL 
  WHERE instructor_id = member_id;

  -- Set promoted_by to NULL in belt history
  UPDATE belt_history 
  SET promoted_by = NULL 
  WHERE promoted_by = member_id;
END;
$$;

-- Update RLS policies for deleted members
CREATE POLICY "Hide deleted members"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (deleted_at IS NULL);

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.delete_member(uuid) TO authenticated;