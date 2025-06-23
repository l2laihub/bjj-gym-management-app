-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Create enum types
CREATE TYPE belt_level AS ENUM ('white', 'blue', 'purple', 'brown', 'black');
CREATE TYPE technique_category AS ENUM ('Guard', 'Mount', 'Side Control', 'Back Control', 'Takedowns', 'Submissions');
CREATE TYPE technique_status AS ENUM ('not_started', 'learning', 'mastered');

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY,
  full_name text,
  email text UNIQUE,
  belt text,
  stripes integer,
  status text,
  birthday date,
  is_minor boolean,
  parent_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz,
  is_deleted boolean DEFAULT false
);

-- Create roles table
CREATE TABLE IF NOT EXISTS public.roles (
  id text PRIMARY KEY,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id text REFERENCES public.roles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);

-- Add unique constraint to auth.users email
ALTER TABLE auth.users ADD CONSTRAINT users_email_unique UNIQUE (email);

-- Create techniques table
CREATE TABLE IF NOT EXISTS public.techniques (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category technique_category NOT NULL,
    belt_level belt_level NOT NULL,
    video_url VARCHAR(255),
    status technique_status DEFAULT 'not_started',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    belt_rank belt_level DEFAULT 'white',
    stripes INTEGER DEFAULT 0 CHECK (stripes >= 0 AND stripes <= 4),
    months_at_current_belt INTEGER DEFAULT 0,
    classes_attended INTEGER DEFAULT 0,
    techniques_learned INTEGER DEFAULT 0,
    techniques_in_progress INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create user_technique_status table
CREATE TABLE IF NOT EXISTS public.user_technique_status (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    technique_id UUID REFERENCES techniques(id) ON DELETE CASCADE,
    status technique_status DEFAULT 'not_started',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, technique_id)
);

-- Create belt_history table
CREATE TABLE IF NOT EXISTS public.belt_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  belt text NOT NULL,
  stripes integer DEFAULT 0,
  promoted_at timestamptz DEFAULT now(),
  promoted_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS public.attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  class_date timestamptz DEFAULT now(),
  class_type text NOT NULL,
  instructor_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

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

-- Create prospects table
CREATE TABLE IF NOT EXISTS public.prospects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  source TEXT,
  interest_level TEXT CHECK (interest_level IN ('High', 'Medium', 'Low')),
  trial_package TEXT,
  first_contact TIMESTAMPTZ DEFAULT now(),
  next_follow_up TIMESTAMPTZ,
  notes TEXT,
  status TEXT CHECK (status IN ('Initial Contact', 'Trial Scheduled', 'Trial Active', 'Converted', 'Lost')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create follow_up_tasks table
CREATE TABLE IF NOT EXISTS public.follow_up_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('call', 'email', 'meeting', 'other')),
  due_date TIMESTAMPTZ NOT NULL,
  notes TEXT,
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')),
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create class_schedule table
CREATE TABLE IF NOT EXISTS public.class_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week text NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  class_name text NOT NULL,
  class_type text NOT NULL,
  age_group text NOT NULL,
  capacity integer DEFAULT 20,
  instructor_id uuid REFERENCES public.profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_is_deleted ON public.profiles(is_deleted);
CREATE INDEX IF NOT EXISTS idx_profiles_deleted_at ON public.profiles(deleted_at);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_belt ON public.profiles(belt);
CREATE INDEX IF NOT EXISTS idx_profiles_full_name ON public.profiles(full_name);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON public.user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_techniques_belt_level ON public.techniques(belt_level);
CREATE INDEX IF NOT EXISTS idx_techniques_category ON public.techniques(category);
CREATE INDEX IF NOT EXISTS idx_techniques_status ON public.techniques(status);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_belt_rank ON public.user_progress(belt_rank);
CREATE INDEX IF NOT EXISTS idx_user_technique_status_user_id ON public.user_technique_status(user_id);
CREATE INDEX IF NOT EXISTS idx_user_technique_status_technique_id ON public.user_technique_status(technique_id);
CREATE INDEX IF NOT EXISTS idx_belt_history_profile_id ON public.belt_history(profile_id);
CREATE INDEX IF NOT EXISTS idx_attendance_profile_id ON public.attendance(profile_id);
CREATE INDEX IF NOT EXISTS idx_attendance_class_date ON public.attendance(class_date);
CREATE INDEX IF NOT EXISTS idx_attendance_class_type ON public.attendance(class_type);
CREATE INDEX IF NOT EXISTS idx_memberships_profile_id ON public.memberships(profile_id);
CREATE INDEX IF NOT EXISTS idx_memberships_status ON public.memberships(status);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_profile_id ON public.emergency_contacts(profile_id);
CREATE INDEX IF NOT EXISTS idx_medical_info_profile_id ON public.medical_info(profile_id);
CREATE INDEX IF NOT EXISTS idx_waivers_profile_id ON public.waivers(profile_id);
CREATE INDEX IF NOT EXISTS idx_prospects_status ON public.prospects(status);
CREATE INDEX IF NOT EXISTS idx_prospects_interest_level ON public.prospects(interest_level);
CREATE INDEX IF NOT EXISTS idx_prospects_next_follow_up ON public.prospects(next_follow_up);
CREATE INDEX IF NOT EXISTS idx_prospects_created_by ON public.prospects(created_by);
CREATE INDEX IF NOT EXISTS idx_follow_up_tasks_prospect_id ON public.follow_up_tasks(prospect_id);
CREATE INDEX IF NOT EXISTS idx_follow_up_tasks_due_date ON public.follow_up_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_follow_up_tasks_completed ON public.follow_up_tasks(completed);
CREATE INDEX IF NOT EXISTS idx_follow_up_tasks_priority ON public.follow_up_tasks(priority);
CREATE INDEX IF NOT EXISTS idx_class_schedule_day_of_week ON public.class_schedule(day_of_week);
CREATE INDEX IF NOT EXISTS idx_class_schedule_instructor_id ON public.class_schedule(instructor_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_techniques_updated_at
    BEFORE UPDATE ON public.techniques
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
    BEFORE UPDATE ON public.user_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_technique_status_updated_at
    BEFORE UPDATE ON public.user_technique_status
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

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

CREATE TRIGGER update_prospects_updated_at
    BEFORE UPDATE ON public.prospects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_follow_up_tasks_updated_at
    BEFORE UPDATE ON public.follow_up_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Functions
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = $1
    AND ur.role_id = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.techniques ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_technique_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.belt_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_up_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_schedule ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Hide deleted members" ON public.profiles FOR ALL TO authenticated USING (deleted_at IS NULL AND NOT COALESCE(is_deleted, false) AND status != 'deleted');
CREATE POLICY "Roles are viewable by authenticated users" ON public.roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own initial role" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND role_id = 'member');
CREATE POLICY "Admins can manage user roles" ON public.user_roles FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Techniques are viewable by everyone" ON public.techniques FOR SELECT USING (true);
CREATE POLICY "Techniques can be inserted by authenticated users with admin role" ON public.techniques FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.raw_user_meta_data->>'role' = 'admin'));
CREATE POLICY "Techniques can be updated by authenticated users with admin role" ON public.techniques FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.raw_user_meta_data->>'role' = 'admin'));
CREATE POLICY "Users can view their own progress" ON public.user_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON public.user_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "New users can insert their progress" ON public.user_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own technique status" ON public.user_technique_status FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own technique status" ON public.user_technique_status FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own technique status" ON public.user_technique_status FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own technique status" ON public.user_technique_status FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view own belt history" ON public.belt_history FOR SELECT TO authenticated USING (auth.uid() = profile_id);
CREATE POLICY "Admins can manage belt history" ON public.belt_history FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Users can view own attendance" ON public.attendance FOR SELECT TO authenticated USING (auth.uid() = profile_id);
CREATE POLICY "Admins can manage attendance" ON public.attendance FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Users can view own membership" ON public.memberships FOR SELECT TO authenticated USING (auth.uid() = profile_id);
CREATE POLICY "Admins can manage all memberships" ON public.memberships FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Users can view own emergency contacts" ON public.emergency_contacts FOR SELECT TO authenticated USING (auth.uid() = profile_id);
CREATE POLICY "Admins can manage all emergency contacts" ON public.emergency_contacts FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Users can view own medical info" ON public.medical_info FOR SELECT TO authenticated USING (auth.uid() = profile_id);
CREATE POLICY "Admins can manage all medical info" ON public.medical_info FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Users can view own waivers" ON public.waivers FOR SELECT TO authenticated USING (auth.uid() = profile_id);
CREATE POLICY "Admins can manage all waivers" ON public.waivers FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can do everything with prospects" ON public.prospects FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Members can view prospects" ON public.prospects FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role_id = 'member'));
CREATE POLICY "Admins can do everything with follow_up_tasks" ON public.follow_up_tasks FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Members can view follow_up_tasks" ON public.follow_up_tasks FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role_id = 'member'));
CREATE POLICY "Anyone can view class schedule" ON public.class_schedule FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage class schedule" ON public.class_schedule FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

CREATE OR REPLACE FUNCTION public.ensure_user_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = NEW.id
  ) THEN
    INSERT INTO public.user_roles (user_id, role_id)
    VALUES (NEW.id, 'member');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_members(
  status_filter text DEFAULT NULL,
  belt_filter text DEFAULT NULL,
  name_search text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  full_name text,
  email text,
  belt text,
  stripes integer,
  status text,
  created_at timestamptz,
  updated_at timestamptz,
  birthday date,
  is_minor boolean,
  parent_name text
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.full_name,
    p.email,
    p.belt,
    p.stripes,
    p.status,
    p.created_at,
    p.updated_at,
    p.birthday,
    p.is_minor,
    p.parent_name
  FROM
    public.profiles p
  WHERE
    (status_filter IS NULL OR p.status = status_filter) AND
    (belt_filter IS NULL OR p.belt = belt_filter) AND
    (name_search IS NULL OR p.full_name ILIKE '%' || name_search || '%');
END;
$$;

CREATE OR REPLACE FUNCTION public.create_member_profile(
  p_email text,
  p_full_name text,
  p_belt text DEFAULT 'white',
  p_stripes int DEFAULT 0,
  p_status text DEFAULT 'active'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, auth
AS $$
DECLARE
  v_user_id uuid;
  v_temp_password text;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role_id = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only administrators can create members' USING ERRCODE = '42501';
  END IF;

  IF EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = p_email 
    AND (raw_app_meta_data->>'deleted')::boolean IS NOT TRUE
  ) THEN
    RAISE EXCEPTION 'A member with this email already exists';
  END IF;

  v_user_id := extensions.uuid_generate_v4();
  v_temp_password := encode(extensions.gen_random_bytes(12), 'base64');

  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  )
  VALUES (
    v_user_id,
    '00000000-0000-0000-0000-000000000000',
    p_email,
    extensions.crypt(v_temp_password, extensions.gen_salt('bf')),
    now(),
    jsonb_build_object(
      'provider', 'email',
      'providers', ARRAY['email']
    ),
    jsonb_build_object(
      'full_name', p_full_name
    ),
    now(),
    now()
  );

  INSERT INTO profiles (
    id,
    email,
    full_name,
    belt,
    stripes,
    status,
    created_at,
    updated_at
  )
  VALUES (
    v_user_id,
    p_email,
    p_full_name,
    p_belt,
    p_stripes,
    p_status,
    now(),
    now()
  );

  INSERT INTO user_roles (user_id, role_id)
  VALUES (v_user_id, 'member');

  INSERT INTO belt_history (
    profile_id,
    belt,
    stripes,
    notes,
    promoted_at,
    promoted_by
  )
  VALUES (
    v_user_id,
    p_belt,
    p_stripes,
    'Initial belt assignment',
    now(),
    auth.uid()
  );

  RETURN v_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_member(member_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_member_name text;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role_id = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only administrators can delete members' USING ERRCODE = '42501';
  END IF;

  SELECT full_name INTO v_member_name
  FROM profiles
  WHERE id = member_id
  AND deleted_at IS NULL
  AND NOT COALESCE(is_deleted, false)
  AND status != 'deleted';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Member not found or already deleted' USING ERRCODE = '42704';
  END IF;

  BEGIN
    UPDATE profiles 
    SET 
      is_deleted = true,
      status = 'deleted',
      updated_at = now(),
      deleted_at = now()
    WHERE id = member_id
    AND deleted_at IS NULL
    AND NOT COALESCE(is_deleted, false)
    AND status != 'deleted';

    UPDATE attendance 
    SET instructor_id = NULL 
    WHERE instructor_id = member_id;

    UPDATE belt_history 
    SET promoted_by = NULL 
    WHERE promoted_by = member_id;

    DELETE FROM user_roles 
    WHERE user_id = member_id;

    DELETE FROM emergency_contacts 
    WHERE profile_id = member_id;

    DELETE FROM medical_info 
    WHERE profile_id = member_id;

    DELETE FROM belt_history 
    WHERE profile_id = member_id;

    DELETE FROM attendance 
    WHERE profile_id = member_id;

    UPDATE auth.users 
    SET raw_app_meta_data = 
      jsonb_set(
        COALESCE(raw_app_meta_data, '{}'::jsonb),
        '{deleted}',
        'true'
      )
    WHERE id = member_id;

    RAISE NOTICE 'Member % (%) successfully deleted', v_member_name, member_id;

  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'Error deleting member % (%): %', v_member_name, member_id, SQLERRM;
      RAISE;
  END;
END;
$$;

CREATE OR REPLACE FUNCTION get_prospects(
  status_filter TEXT DEFAULT NULL,
  interest_filter TEXT DEFAULT NULL,
  search_term TEXT DEFAULT NULL
)
RETURNS SETOF prospects
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM prospects
  WHERE (status_filter IS NULL OR status = status_filter)
  AND (interest_filter IS NULL OR interest_level = interest_filter)
  AND (
    search_term IS NULL
    OR full_name ILIKE '%' || search_term || '%'
    OR COALESCE(email, '') ILIKE '%' || search_term || '%'
    OR COALESCE(phone, '') ILIKE '%' || search_term || '%'
  )
  ORDER BY next_follow_up ASC NULLS LAST;
END;
$$;

CREATE OR REPLACE FUNCTION get_pending_follow_ups()
RETURNS SETOF follow_up_tasks
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT ft.*
  FROM follow_up_tasks ft
  WHERE ft.completed = false
  AND ft.due_date >= CURRENT_DATE
  ORDER BY ft.due_date ASC, ft.priority DESC;
END;
$$;

CREATE OR REPLACE FUNCTION get_prospect_stats()
RETURNS TABLE (
  active_prospects BIGINT,
  conversion_rate NUMERIC,
  high_interest BIGINT,
  pending_follow_ups BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM prospects WHERE status != 'Converted' AND status != 'Lost') AS active_prospects,
    COALESCE(
      (SELECT 
        ROUND((COUNT(*) FILTER (WHERE status = 'Converted')::NUMERIC / 
        NULLIF(COUNT(*), 0)::NUMERIC) * 100, 1)
      FROM prospects),
      0
    ) AS conversion_rate,
    (SELECT COUNT(*) FROM prospects WHERE interest_level = 'High' AND status != 'Converted' AND status != 'Lost') AS high_interest,
    (SELECT COUNT(*) FROM follow_up_tasks WHERE completed = false AND due_date >= CURRENT_DATE) AS pending_follow_ups;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_members(text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_member_profile(text, text, text, int, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_member(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_prospects(TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_pending_follow_ups() TO authenticated;
GRANT EXECUTE ON FUNCTION get_prospect_stats() TO authenticated;