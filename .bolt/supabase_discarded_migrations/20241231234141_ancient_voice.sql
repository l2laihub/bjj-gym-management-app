/*
  # Test Data Population

  1. Sample Data
    - Admin and member users
    - Member profiles with various belt levels
    - Emergency contacts
    - Medical information
    - Memberships
    - Belt history
    - Attendance records
    - Waivers

  2. Notes
    - All timestamps use current_timestamp for consistency
    - Realistic data patterns for BJJ gym
*/

-- Insert test users and profiles
INSERT INTO auth.users (id, email, email_confirmed_at)
VALUES 
  ('d0d8d9e2-0e13-4c0c-9e54-5d5b6d60d1d0', 'admin@hevabjj.com', current_timestamp),
  ('8f9f9e2a-5e5e-4c0c-9e54-5d5b6d60d1d1', 'john.silva@email.com', current_timestamp),
  ('7a8b9c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3d', 'maria.santos@email.com', current_timestamp),
  ('6b7c8d9e-1f2g-3h4i-5j6k-7l8m9n0o1p2q', 'alex.thompson@email.com', current_timestamp)
ON CONFLICT (id) DO NOTHING;

-- Insert profiles
INSERT INTO public.profiles (id, full_name, belt, stripes, status)
VALUES
  ('d0d8d9e2-0e13-4c0c-9e54-5d5b6d60d1d0', 'Admin User', 'black', 2, 'active'),
  ('8f9f9e2a-5e5e-4c0c-9e54-5d5b6d60d1d1', 'John Silva', 'purple', 2, 'active'),
  ('7a8b9c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3d', 'Maria Santos', 'blue', 4, 'active'),
  ('6b7c8d9e-1f2g-3h4i-5j6k-7l8m9n0o1p2q', 'Alex Thompson', 'brown', 1, 'active')
ON CONFLICT (id) DO NOTHING;

-- Assign roles
INSERT INTO public.user_roles (user_id, role_id)
VALUES
  ('d0d8d9e2-0e13-4c0c-9e54-5d5b6d60d1d0', 'admin'),
  ('8f9f9e2a-5e5e-4c0c-9e54-5d5b6d60d1d1', 'member'),
  ('7a8b9c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3d', 'member'),
  ('6b7c8d9e-1f2g-3h4i-5j6k-7l8m9n0o1p2q', 'member')
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Insert emergency contacts
INSERT INTO public.emergency_contacts (profile_id, name, relationship, phone, is_primary)
VALUES
  ('8f9f9e2a-5e5e-4c0c-9e54-5d5b6d60d1d1', 'Mary Silva', 'Spouse', '555-0123', true),
  ('7a8b9c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3d', 'Carlos Santos', 'Father', '555-0124', true),
  ('6b7c8d9e-1f2g-3h4i-5j6k-7l8m9n0o1p2q', 'Emma Thompson', 'Sister', '555-0125', true);

-- Insert medical info
INSERT INTO public.medical_info (profile_id, conditions, allergies, medications, blood_type)
VALUES
  ('8f9f9e2a-5e5e-4c0c-9e54-5d5b6d60d1d1', ARRAY['None'], ARRAY['Penicillin'], ARRAY['None'], 'O+'),
  ('7a8b9c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3d', ARRAY['Asthma'], ARRAY['None'], ARRAY['Inhaler'], 'A+'),
  ('6b7c8d9e-1f2g-3h4i-5j6k-7l8m9n0o1p2q', ARRAY['None'], ARRAY['None'], ARRAY['None'], 'B+');

-- Insert memberships
INSERT INTO public.memberships (profile_id, type, start_date, end_date, status, payment_frequency, monthly_fee)
VALUES
  ('8f9f9e2a-5e5e-4c0c-9e54-5d5b6d60d1d1', 'Unlimited', current_timestamp - interval '1 year', current_timestamp + interval '1 year', 'active', 'monthly', 150.00),
  ('7a8b9c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3d', 'Unlimited', current_timestamp - interval '6 months', current_timestamp + interval '6 months', 'active', 'monthly', 150.00),
  ('6b7c8d9e-1f2g-3h4i-5j6k-7l8m9n0o1p2q', 'Unlimited', current_timestamp - interval '3 months', current_timestamp + interval '9 months', 'active', 'monthly', 150.00);

-- Insert belt history
INSERT INTO public.belt_history (profile_id, belt, stripes, promoted_by, notes)
VALUES
  ('8f9f9e2a-5e5e-4c0c-9e54-5d5b6d60d1d1', 'purple', 2, 'd0d8d9e2-0e13-4c0c-9e54-5d5b6d60d1d0', 'Excellent progress in competition'),
  ('7a8b9c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3d', 'blue', 4, 'd0d8d9e2-0e13-4c0c-9e54-5d5b6d60d1d0', 'Consistent training and improvement'),
  ('6b7c8d9e-1f2g-3h4i-5j6k-7l8m9n0o1p2q', 'brown', 1, 'd0d8d9e2-0e13-4c0c-9e54-5d5b6d60d1d0', 'Outstanding technical development');

-- Insert attendance records
INSERT INTO public.attendance (profile_id, class_type, instructor_id)
VALUES
  ('8f9f9e2a-5e5e-4c0c-9e54-5d5b6d60d1d1', 'Gi Class', 'd0d8d9e2-0e13-4c0c-9e54-5d5b6d60d1d0'),
  ('7a8b9c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3d', 'No-Gi Class', 'd0d8d9e2-0e13-4c0c-9e54-5d5b6d60d1d0'),
  ('6b7c8d9e-1f2g-3h4i-5j6k-7l8m9n0o1p2q', 'Open Mat', 'd0d8d9e2-0e13-4c0c-9e54-5d5b6d60d1d0');

-- Insert waivers
INSERT INTO public.waivers (profile_id, type, signed_at, expires_at)
VALUES
  ('8f9f9e2a-5e5e-4c0c-9e54-5d5b6d60d1d1', 'Liability', current_timestamp, current_timestamp + interval '1 year'),
  ('7a8b9c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3d', 'Liability', current_timestamp, current_timestamp + interval '1 year'),
  ('6b7c8d9e-1f2g-3h4i-5j6k-7l8m9n0o1p2q', 'Liability', current_timestamp, current_timestamp + interval '1 year');