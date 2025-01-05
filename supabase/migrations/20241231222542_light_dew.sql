/*
  # Fix User Roles Schema

  1. Changes
    - Drop and recreate roles and user_roles tables
    - Add proper constraints and indexes
    - Update RLS policies
    - Insert default roles

  2. Security
    - Enable RLS
    - Add policies for role management
*/

-- Drop existing tables if they exist
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