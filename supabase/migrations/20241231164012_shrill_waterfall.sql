/*
  # Fix Role Assignment

  1. Changes
    - Add missing policies for admin role management
    - Fix role assignment during signup
    - Add function to check and assign default role

  2. Security
    - Maintain existing RLS
    - Add secure role management
*/

-- Function to ensure user has at least one role
CREATE OR REPLACE FUNCTION public.ensure_user_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = NEW.id
  ) THEN
    -- Assign default member role if no role exists
    INSERT INTO public.user_roles (user_id, role_id)
    VALUES (NEW.id, 'member');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to ensure user role
DROP TRIGGER IF EXISTS ensure_user_role_trigger ON auth.users;
CREATE TRIGGER ensure_user_role_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_user_role();

-- Update policies for better role management
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
CREATE POLICY "Admins can manage all roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Ensure indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON public.user_roles(role_id);