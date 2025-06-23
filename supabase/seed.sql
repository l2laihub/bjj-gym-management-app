-- Insert default roles
INSERT INTO public.roles (id, description)
VALUES 
  ('admin', 'Administrator with full access'),
  ('member', 'Regular gym member')
ON CONFLICT (id) DO NOTHING;

-- Insert test users and profiles
INSERT INTO auth.users (id, email, email_confirmed_at)
VALUES
  ('d0d8d9e2-0e13-4c0c-9e54-5d5b6d60d1d0', 'admin@hevabjj.com', current_timestamp),
  ('8f9f9e2a-5e5e-4c0c-9e54-5d5b6d60d1d1', 'john.silva@email.com', current_timestamp),
  ('7a8b9c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3d', 'maria.santos@email.com', current_timestamp),
  ('2adf72c2-3e76-4d38-ae36-ce1d6ae8039b', 'alex.thompson@email.com', current_timestamp)
ON CONFLICT (email) DO NOTHING;

-- Insert profiles
INSERT INTO public.profiles (id, full_name, email, belt, stripes, status)
VALUES
  ('d0d8d9e2-0e13-4c0c-9e54-5d5b6d60d1d0', 'Admin User', 'admin@hevabjj.com', 'black', 2, 'active'),
  ('8f9f9e2a-5e5e-4c0c-9e54-5d5b6d60d1d1', 'John Silva', 'john.silva@email.com', 'purple', 2, 'active'),
  ('7a8b9c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3d', 'Maria Santos', 'maria.santos@email.com', 'blue', 4, 'active'),
  ('2adf72c2-3e76-4d38-ae36-ce1d6ae8039b', 'Alex Thompson', 'alex.thompson@email.com', 'brown', 1, 'active')
ON CONFLICT (email) DO NOTHING;

-- Assign roles
INSERT INTO public.user_roles (user_id, role_id)
VALUES
  ('d0d8d9e2-0e13-4c0c-9e54-5d5b6d60d1d0', 'admin'),
  ('8f9f9e2a-5e5e-4c0c-9e54-5d5b6d60d1d1', 'member'),
  ('7a8b9c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3d', 'member'),
  ('2adf72c2-3e76-4d38-ae36-ce1d6ae8039b', 'member')
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Insert emergency contacts
INSERT INTO public.emergency_contacts (profile_id, name, relationship, phone, is_primary)
VALUES
  ('8f9f9e2a-5e5e-4c0c-9e54-5d5b6d60d1d1', 'Mary Silva', 'Spouse', '555-0123', true),
  ('7a8b9c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3d', 'Carlos Santos', 'Father', '555-0124', true),
  ('2adf72c2-3e76-4d38-ae36-ce1d6ae8039b', 'Emma Thompson', 'Sister', '555-0125', true);

-- Insert medical info
INSERT INTO public.medical_info (profile_id, conditions, allergies, medications, blood_type)
VALUES
  ('8f9f9e2a-5e5e-4c0c-9e54-5d5b6d60d1d1', ARRAY['None'], ARRAY['Penicillin'], ARRAY['None'], 'O+'),
  ('7a8b9c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3d', ARRAY['Asthma'], ARRAY['None'], ARRAY['Inhaler'], 'A+'),
  ('2adf72c2-3e76-4d38-ae36-ce1d6ae8039b', ARRAY['None'], ARRAY['None'], ARRAY['None'], 'B+');

-- Insert memberships
INSERT INTO public.memberships (profile_id, type, start_date, end_date, status, payment_frequency, monthly_fee)
VALUES
  ('8f9f9e2a-5e5e-4c0c-9e54-5d5b6d60d1d1', 'Unlimited', current_timestamp - interval '1 year', current_timestamp + interval '1 year', 'active', 'monthly', 150.00),
  ('7a8b9c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3d', 'Unlimited', current_timestamp - interval '6 months', current_timestamp + interval '6 months', 'active', 'monthly', 150.00),
  ('2adf72c2-3e76-4d38-ae36-ce1d6ae8039b', 'Unlimited', current_timestamp - interval '3 months', current_timestamp + interval '9 months', 'active', 'monthly', 150.00);

-- Insert belt history
INSERT INTO public.belt_history (profile_id, belt, stripes, promoted_by, notes)
VALUES
  ('8f9f9e2a-5e5e-4c0c-9e54-5d5b6d60d1d1', 'purple', 2, 'd0d8d9e2-0e13-4c0c-9e54-5d5b6d60d1d0', 'Excellent progress in competition'),
  ('7a8b9c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3d', 'blue', 4, 'd0d8d9e2-0e13-4c0c-9e54-5d5b6d60d1d0', 'Consistent training and improvement'),
  ('2adf72c2-3e76-4d38-ae36-ce1d6ae8039b', 'brown', 1, 'd0d8d9e2-0e13-4c0c-9e54-5d5b6d60d1d0', 'Outstanding technical development');

-- Insert attendance records
INSERT INTO public.attendance (profile_id, class_type, instructor_id)
VALUES
  ('8f9f9e2a-5e5e-4c0c-9e54-5d5b6d60d1d1', 'Gi Class', 'd0d8d9e2-0e13-4c0c-9e54-5d5b6d60d1d0'),
  ('7a8b9c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3d', 'No-Gi Class', 'd0d8d9e2-0e13-4c0c-9e54-5d5b6d60d1d0'),
  ('2adf72c2-3e76-4d38-ae36-ce1d6ae8039b', 'Open Mat', 'd0d8d9e2-0e13-4c0c-9e54-5d5b6d60d1d0');

-- Insert waivers
INSERT INTO public.waivers (profile_id, type, signed_at, expires_at)
VALUES
  ('8f9f9e2a-5e5e-4c0c-9e54-5d5b6d60d1d1', 'Liability', current_timestamp, current_timestamp + interval '1 year'),
  ('7a8b9c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3d', 'Liability', current_timestamp, current_timestamp + interval '1 year'),
  ('2adf72c2-3e76-4d38-ae36-ce1d6ae8039b', 'Liability', current_timestamp, current_timestamp + interval '1 year');

-- Insert sample data for class schedule
INSERT INTO public.class_schedule (day_of_week, start_time, end_time, class_name, class_type, age_group)
VALUES
  ('Monday', '16:30:00', '17:10:00', 'Saplings Gi Class', 'gi', '3-5 yrs'),
  ('Monday', '17:30:00', '18:15:00', 'Kids Gi Class', 'gi', 'Kids'),
  ('Monday', '18:30:00', '19:30:00', 'Adults Gi Class', 'gi', 'Adults'),
  ('Monday', '19:30:00', '20:00:00', 'Open Mat', 'open', 'Adults'),
  ('Tuesday', '17:30:00', '18:15:00', 'Kids Gi Class', 'gi', 'Kids'),
  ('Tuesday', '18:30:00', '19:30:00', 'Adults Gi Class', 'gi', 'Adults'),
  ('Tuesday', '19:30:00', '20:00:00', 'Open Mat', 'open', 'Adults'),
  ('Wednesday', '17:30:00', '18:15:00', 'Kids No Gi & Wrestling', 'nogi', 'Kids'),
  ('Wednesday', '18:30:00', '19:30:00', 'Adults No Gi', 'nogi', 'Adults'),
  ('Wednesday', '19:30:00', '20:00:00', 'Open Mat', 'open', 'Adults'),
  ('Thursday', '17:30:00', '18:15:00', 'Kids Gi Class', 'gi', 'Kids'),
  ('Thursday', '18:30:00', '19:30:00', 'Adults Gi Class', 'gi', 'Adults'),
  ('Thursday', '19:30:00', '20:00:00', 'Open Mat', 'open', 'Adults'),
  ('Friday', '16:30:00', '17:10:00', 'Saplings Gi Class', 'gi', '3-5 yrs'),
  ('Friday', '17:30:00', '18:15:00', 'Kids Gi Class', 'gi', 'Kids'),
  ('Friday', '18:30:00', '19:30:00', 'Adults Gi Class', 'gi', 'Adults'),
  ('Friday', '19:30:00', '20:00:00', 'Open Mat', 'open', 'Adults'),
  ('Saturday', '10:30:00', '12:00:00', 'Open Mat', 'open', 'Adults');
