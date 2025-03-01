-- Remove the foreign key constraint from profiles table
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    -- Drop all existing policies
    DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
    DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
    DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
    DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;
    DROP POLICY IF EXISTS "Hide deleted members" ON profiles;
    DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
END $$;

-- Create new policies with existence checks
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Admins can manage all profiles'
    ) THEN
        CREATE POLICY "Admins can manage all profiles"
            ON profiles
            FOR ALL
            TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM user_roles ur
                    WHERE ur.user_id = auth.uid()
                    AND ur.role_id = 'admin'
                )
            );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can read own profile'
    ) THEN
        CREATE POLICY "Users can read own profile"
            ON profiles
            FOR SELECT
            TO authenticated
            USING (
                id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM user_roles ur
                    WHERE ur.user_id = auth.uid()
                    AND ur.role_id = 'admin'
                )
            );
    END IF;
END $$;

-- Add a new unique constraint on email
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_email_unique;
ALTER TABLE profiles ADD CONSTRAINT profiles_email_unique UNIQUE (email);