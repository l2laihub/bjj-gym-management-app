/*
  # Add helper functions for member management

  1. New Functions
    - assign_member_role: Safely assign member role
    - record_belt_promotion: Safely record belt promotions
*/

-- Function to assign member role
CREATE OR REPLACE FUNCTION public.assign_member_role(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO user_roles (user_id, role_id)
  VALUES (p_user_id, 'member')
  ON CONFLICT (user_id, role_id) DO NOTHING;
END;
$$;

-- Function to record belt promotion
CREATE OR REPLACE FUNCTION public.record_belt_promotion(
  p_profile_id uuid,
  p_belt text,
  p_stripes int,
  p_notes text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO belt_history (
    profile_id,
    belt,
    stripes,
    notes,
    promoted_at,
    promoted_by
  )
  VALUES (
    p_profile_id,
    p_belt,
    p_stripes,
    p_notes,
    now(),
    auth.uid()
  );
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.assign_member_role(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.record_belt_promotion(uuid, text, int, text) TO authenticated;