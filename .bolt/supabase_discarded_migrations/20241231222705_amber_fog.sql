/*
  # Fix User Roles Schema with Dependencies

  1. Changes
    - Drop dependent policies first
    - Recreate tables and policies in correct order
    - Add proper constraints and indexes

  2. Security
    - Enable RLS
    - Add policies for role management
*/

-- First drop the dependent policy
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

-- Now we can safely drop and recreate the tables
DROP TABLE IF EXISTS public.user_roles;
DROP TABLE IF EXISTS public.roles;

-- Create roles table
CREATE TABLE IF NOT EXISTS public.roles (
  id text PRIMARY KEY,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  role_id text REFERENCES public.roles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);

-- Enable RLS
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Roles viewable by authenticated users"
  ON public.roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert default roles
INSERT INTO public.roles (id, description)
VALUES 
  ('admin', 'Administrator with full access'),
  ('member', 'Regular gym member')
ON CONFLICT (id) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON public.user_roles(role_id);

-- Recreate the admin policy for profiles
CREATE POLICY "Admins can manage all profiles"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = 'admin'
    )
  );