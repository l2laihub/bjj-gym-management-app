/*
  # Members Management Schema

  1. New Tables
    - Extends profiles table with BJJ-specific fields
    - Adds belt history tracking
    - Adds attendance tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for member management
    - Add policies for attendance tracking

  3. Changes
    - Adds BJJ-specific fields to profiles
    - Creates belt_history table
    - Creates attendance table
*/

-- Add BJJ-specific fields to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS belt text,
ADD COLUMN IF NOT EXISTS stripes integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active',
ADD COLUMN IF NOT EXISTS emergency_contact jsonb,
ADD COLUMN IF NOT EXISTS medical_info jsonb,
ADD COLUMN IF NOT EXISTS membership_type text,
ADD COLUMN IF NOT EXISTS membership_start_date timestamptz,
ADD COLUMN IF NOT EXISTS membership_end_date timestamptz;

-- Create belt history table
CREATE TABLE IF NOT EXISTS public.belt_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  belt text NOT NULL,
  stripes integer DEFAULT 0,
  promoted_at timestamptz DEFAULT now(),
  promoted_by uuid REFERENCES public.profiles(id),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS public.attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  class_date timestamptz DEFAULT now(),
  class_type text NOT NULL,
  instructor_id uuid REFERENCES public.profiles(id),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.belt_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Policies for belt_history
CREATE POLICY "Users can view own belt history"
  ON public.belt_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = profile_id);

CREATE POLICY "Admins can manage belt history"
  ON public.belt_history
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = 'admin'
    )
  );

-- Policies for attendance
CREATE POLICY "Users can view own attendance"
  ON public.attendance
  FOR SELECT
  TO authenticated
  USING (auth.uid() = profile_id);

CREATE POLICY "Admins can manage attendance"
  ON public.attendance
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = 'admin'
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_belt_history_profile_id ON public.belt_history(profile_id);
CREATE INDEX IF NOT EXISTS idx_attendance_profile_id ON public.attendance(profile_id);
CREATE INDEX IF NOT EXISTS idx_profiles_belt ON public.profiles(belt);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);