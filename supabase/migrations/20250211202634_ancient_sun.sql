-- Create function to handle member deletion
CREATE OR REPLACE FUNCTION public.delete_member(member_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete emergency contacts
  DELETE FROM emergency_contacts WHERE profile_id = member_id;
  
  -- Delete medical info
  DELETE FROM medical_info WHERE profile_id = member_id;
  
  -- Delete belt history
  DELETE FROM belt_history WHERE profile_id = member_id;
  
  -- Delete attendance records
  DELETE FROM attendance WHERE profile_id = member_id;
  
  -- Delete user roles
  DELETE FROM user_roles WHERE user_id = member_id;
  
  -- Delete profile
  DELETE FROM profiles WHERE id = member_id;
  
  -- Note: We can't delete from auth.users as it requires admin access
  -- Instead, mark the profile as deleted which will prevent login
  UPDATE auth.users 
  SET raw_app_meta_data = 
    jsonb_set(
      COALESCE(raw_app_meta_data, '{}'::jsonb),
      '{deleted}',
      'true'
    )
  WHERE id = member_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.delete_member(uuid) TO authenticated;

-- Create policy to allow only admins to execute the function
CREATE POLICY "Only admins can delete members" ON profiles
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = 'admin'
    )
  );