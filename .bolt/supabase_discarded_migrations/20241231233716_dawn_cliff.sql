/*
  # Member Management Schema Update

  1. New Tables
    - `memberships` - Track membership details and history
    - `emergency_contacts` - Store emergency contact information
    - `medical_info` - Store medical information
    - `waivers` - Track signed waivers and agreements
    
  2. Security
    - Enable RLS on all tables
    - Add policies for member and admin access
    
  3. Changes
    - Add foreign key relationships
    - Create necessary indexes
*/

-- Create memberships table
CREATE TABLE IF NOT EXISTS public.memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz,
  status text NOT NULL DEFAULT 'active',
  payment_frequency text,
  monthly_fee decimal(10,2),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create emergency_contacts table
CREATE TABLE IF NOT EXISTS public.emergency_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  relationship text NOT NULL,
  phone text NOT NULL,
  email text,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create medical_info table
CREATE TABLE IF NOT EXISTS public.medical_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  conditions text[],
  allergies text[],
  medications text[],
  blood_type text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create waivers table
CREATE TABLE IF NOT EXISTS public.waivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  signed_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  document_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waivers ENABLE ROW LEVEL SECURITY;

-- Policies for memberships
CREATE POLICY "Users can view own membership"
  ON public.memberships FOR SELECT
  TO authenticated
  USING (auth.uid() = profile_id);

CREATE POLICY "Admins can manage all memberships"
  ON public.memberships FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = 'admin'
    )
  );

-- Policies for emergency_contacts
CREATE POLICY "Users can view own emergency contacts"
  ON public.emergency_contacts FOR SELECT
  TO authenticated
  USING (auth.uid() = profile_id);

CREATE POLICY "Admins can manage all emergency contacts"
  ON public.emergency_contacts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = 'admin'
    )
  );

-- Policies for medical_info
CREATE POLICY "Users can view own medical info"
  ON public.medical_info FOR SELECT
  TO authenticated
  USING (auth.uid() = profile_id);

CREATE POLICY "Admins can manage all medical info"
  ON public.medical_info FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = 'admin'
    )
  );

-- Policies for waivers
CREATE POLICY "Users can view own waivers"
  ON public.waivers FOR SELECT
  TO authenticated
  USING (auth.uid() = profile_id);

CREATE POLICY "Admins can manage all waivers"
  ON public.waivers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = 'admin'
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_memberships_profile_id ON public.memberships(profile_id);
CREATE INDEX IF NOT EXISTS idx_memberships_status ON public.memberships(status);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_profile_id ON public.emergency_contacts(profile_id);
CREATE INDEX IF NOT EXISTS idx_medical_info_profile_id ON public.medical_info(profile_id);
CREATE INDEX IF NOT EXISTS idx_waivers_profile_id ON public.waivers(profile_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_memberships_updated_at
    BEFORE UPDATE ON public.memberships
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_emergency_contacts_updated_at
    BEFORE UPDATE ON public.emergency_contacts
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_medical_info_updated_at
    BEFORE UPDATE ON public.medical_info
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();