-- Create enum types
CREATE TYPE belt_level AS ENUM ('white', 'blue', 'purple', 'brown', 'black');
CREATE TYPE technique_category AS ENUM ('Guard', 'Mount', 'Side Control', 'Back Control', 'Takedowns', 'Submissions');
CREATE TYPE technique_status AS ENUM ('not_started', 'learning', 'mastered');

-- Create techniques table
CREATE TABLE techniques (
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
CREATE TABLE user_progress (
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

-- Create user_technique_status table to track individual user progress on techniques
CREATE TABLE user_technique_status (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    technique_id UUID REFERENCES techniques(id) ON DELETE CASCADE,
    status technique_status DEFAULT 'not_started',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, technique_id)
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_techniques_updated_at
    BEFORE UPDATE ON techniques
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
    BEFORE UPDATE ON user_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_technique_status_updated_at
    BEFORE UPDATE ON user_technique_status
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE techniques ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_technique_status ENABLE ROW LEVEL SECURITY;

-- Create policies for techniques table
CREATE POLICY "Techniques are viewable by everyone"
    ON techniques FOR SELECT
    USING (true);

CREATE POLICY "Techniques can be inserted by authenticated users with admin role"
    ON techniques FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND auth.users.raw_user_meta_data->>'role' = 'admin'
    ));

CREATE POLICY "Techniques can be updated by authenticated users with admin role"
    ON techniques FOR UPDATE
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND auth.users.raw_user_meta_data->>'role' = 'admin'
    ));

-- Create policies for user_progress table
CREATE POLICY "Users can view their own progress"
    ON user_progress FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
    ON user_progress FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "New users can insert their progress"
    ON user_progress FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Create policies for user_technique_status table
CREATE POLICY "Users can view their own technique status"
    ON user_technique_status FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own technique status"
    ON user_technique_status FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own technique status"
    ON user_technique_status FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own technique status"
    ON user_technique_status FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_techniques_belt_level ON techniques(belt_level);
CREATE INDEX idx_techniques_category ON techniques(category);
CREATE INDEX idx_techniques_status ON techniques(status);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_belt_rank ON user_progress(belt_rank);
CREATE INDEX idx_user_technique_status_user_id ON user_technique_status(user_id);
CREATE INDEX idx_user_technique_status_technique_id ON user_technique_status(technique_id);
