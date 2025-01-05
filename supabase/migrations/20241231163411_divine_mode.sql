/*
  # Create roles and user_roles tables
  
  1. New Tables
    - roles
      - id (text, primary key)
      - description (text)
    - user_roles
      - user_id (uuid, references profiles)
      - role_id (text, references roles)
      - created_at (timestamptz)
  
  2. Security
    - Enable RLS
    - Add policies for role management
    - Insert default roles
*/

-- Create roles table
CREATE TABLE IF NOT EXISTS public.roles (
  id text PRIMARY KEY,
  description text NOT NULL
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_id text REFERENCES public.roles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);

-- Enable RLS
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policies for roles table
CREATE POLICY "Roles are viewable by authenticated users"
  ON public.roles
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for user_roles table
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage user roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = 'admin'
    )
  );

-- Insert default roles
INSERT INTO public.roles (id, description)
VALUES 
  ('admin', 'Administrator with full access'),
  ('member', 'Regular gym member')
ON CONFLICT (id) DO NOTHING;