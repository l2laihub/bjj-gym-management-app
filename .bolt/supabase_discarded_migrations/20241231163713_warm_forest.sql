/*
  # Fix Role-Based Access Control

  1. Changes
    - Drop existing roles and user_roles tables to fix structure
    - Recreate roles and user_roles tables with proper constraints
    - Add proper RLS policies
    - Insert default roles
    - Add function to check admin role

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access
    - Add helper function for admin checks
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.user_roles;
DROP TABLE IF EXISTS public.roles;

-- Create roles table
CREATE TABLE public.roles (
  id text PRIMARY KEY,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  role_id text REFERENCES public.roles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);

-- Enable RLS
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create admin check function
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = $1
    AND ur.role_id = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies for roles table
CREATE POLICY "Roles viewable by authenticated users"
  ON public.roles FOR SELECT
  TO authenticated
  USING (true);

-- Policies for user_roles table
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Insert default roles
INSERT INTO public.roles (id, description)
VALUES 
  ('admin', 'Administrator with full access'),
  ('member', 'Regular gym member')
ON CONFLICT (id) DO NOTHING;