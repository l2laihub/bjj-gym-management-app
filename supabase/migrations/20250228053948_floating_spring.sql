/*
  # Prospects and Follow-up Tasks Schema

  1. New Tables
    - `prospects`
      - `id` (uuid, primary key)
      - `full_name` (text, required)
      - `email` (text)
      - `phone` (text)
      - `source` (text)
      - `interest_level` (text, enum)
      - `trial_package` (text)
      - `first_contact` (timestamptz)
      - `next_follow_up` (timestamptz)
      - `notes` (text)
      - `status` (text, enum)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `created_by` (uuid, references auth.users)
    
    - `follow_up_tasks`
      - `id` (uuid, primary key)
      - `prospect_id` (uuid, references prospects)
      - `type` (text, enum)
      - `due_date` (timestamptz)
      - `notes` (text)
      - `priority` (text, enum)
      - `completed` (boolean)
      - `completed_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `created_by` (uuid, references auth.users)
  
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
    - Add policies for admin users
*/

-- Create prospects table
CREATE TABLE IF NOT EXISTS prospects (
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
CREATE TABLE IF NOT EXISTS follow_up_tasks (
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

-- Enable RLS
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_up_tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for prospects table
CREATE POLICY "Admins can do everything with prospects"
ON prospects
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role_id = 'admin'
  )
);

CREATE POLICY "Members can view prospects"
ON prospects
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role_id = 'member'
  )
);

-- Create policies for follow_up_tasks table
CREATE POLICY "Admins can do everything with follow_up_tasks"
ON follow_up_tasks
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role_id = 'admin'
  )
);

CREATE POLICY "Members can view follow_up_tasks"
ON follow_up_tasks
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role_id = 'member'
  )
);

-- Create indexes for better performance
CREATE INDEX idx_prospects_status ON prospects(status);
CREATE INDEX idx_prospects_interest_level ON prospects(interest_level);
CREATE INDEX idx_prospects_next_follow_up ON prospects(next_follow_up);
CREATE INDEX idx_prospects_created_by ON prospects(created_by);

CREATE INDEX idx_follow_up_tasks_prospect_id ON follow_up_tasks(prospect_id);
CREATE INDEX idx_follow_up_tasks_due_date ON follow_up_tasks(due_date);
CREATE INDEX idx_follow_up_tasks_completed ON follow_up_tasks(completed);
CREATE INDEX idx_follow_up_tasks_priority ON follow_up_tasks(priority);

-- Create function to get prospects with filtering
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

-- Function to get pending follow-up tasks
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

-- Function to get prospect statistics
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

-- Create triggers to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_prospects_updated_at
BEFORE UPDATE ON prospects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_follow_up_tasks_updated_at
BEFORE UPDATE ON follow_up_tasks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_prospects(TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_pending_follow_ups() TO authenticated;
GRANT EXECUTE ON FUNCTION get_prospect_stats() TO authenticated;