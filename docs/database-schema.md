# Database Schema Documentation

## Overview

The BJJ Gym Management Application uses a PostgreSQL database through Supabase. This document outlines the database schema, including tables, relationships, and security policies.

## Enum Types

### `belt_level`
- `white`
- `blue`
- `purple`
- `brown`
- `black`

### `technique_category`
- `Guard`
- `Mount`
- `Side Control`
- `Back Control`
- `Takedowns`
- `Submissions`

### `technique_status`
- `not_started`
- `learning`
- `mastered`

## Tables

### `techniques`
Stores BJJ techniques and their details.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(255) | Technique name |
| description | TEXT | Detailed description |
| category | technique_category | Technique category |
| belt_level | belt_level | Required belt level |
| video_url | VARCHAR(255) | Optional instructional video |
| status | technique_status | Learning status |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

**Indexes:**
- `idx_techniques_belt_level`
- `idx_techniques_category`
- `idx_techniques_status`

### `user_progress`
Tracks individual user's progression in BJJ.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References auth.users |
| belt_rank | belt_level | Current belt level |
| stripes | INTEGER | Number of stripes (0-4) |
| months_at_current_belt | INTEGER | Time at current rank |
| classes_attended | INTEGER | Total classes attended |
| techniques_learned | INTEGER | Mastered techniques |
| techniques_in_progress | INTEGER | Techniques being learned |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

**Constraints:**
- Unique constraint on `user_id`
- Check constraint on stripes (0-4)

**Indexes:**
- `idx_user_progress_user_id`
- `idx_user_progress_belt_rank`

### `user_technique_status`
Tracks individual progress on specific techniques.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References auth.users |
| technique_id | UUID | References techniques |
| status | technique_status | Learning status |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

**Constraints:**
- Unique constraint on `(user_id, technique_id)`

**Indexes:**
- `idx_user_technique_status_user_id`
- `idx_user_technique_status_technique_id`

## Automatic Timestamps

All tables include `created_at` and `updated_at` timestamps. The `updated_at` column is automatically updated through triggers using the `update_updated_at_column()` function.

## Row Level Security (RLS)

### Techniques Table

1. **Select Policy**: Everyone can view techniques
   ```sql
   CREATE POLICY "Techniques are viewable by everyone"
       ON techniques FOR SELECT
       USING (true);
   ```

2. **Insert Policy**: Only admin users can add techniques
   ```sql
   CREATE POLICY "Techniques can be inserted by authenticated users with admin role"
       ON techniques FOR INSERT
       TO authenticated
       WITH CHECK (...);
   ```

3. **Update Policy**: Only admin users can modify techniques
   ```sql
   CREATE POLICY "Techniques can be updated by authenticated users with admin role"
       ON techniques FOR UPDATE
       TO authenticated
       USING (...);
   ```

### User Progress Table

1. **Select Policy**: Users can only view their own progress
   ```sql
   CREATE POLICY "Users can view their own progress"
       ON user_progress FOR SELECT
       TO authenticated
       USING (auth.uid() = user_id);
   ```

2. **Update Policy**: Users can only update their own progress
   ```sql
   CREATE POLICY "Users can update their own progress"
       ON user_progress FOR UPDATE
       TO authenticated
       USING (auth.uid() = user_id);
   ```

3. **Insert Policy**: New users can create their progress entry
   ```sql
   CREATE POLICY "New users can insert their progress"
       ON user_progress FOR INSERT
       TO authenticated
       WITH CHECK (auth.uid() = user_id);
   ```

### User Technique Status Table

1. **Select Policy**: Users can only view their own technique status
2. **Update Policy**: Users can only update their own technique status
3. **Insert Policy**: Users can only add their own technique status
4. **Delete Policy**: Users can only delete their own technique status

## Performance Considerations

1. **Indexes**
   - All foreign keys are indexed
   - Common query fields have appropriate indexes
   - Composite indexes for frequently combined queries

2. **Constraints**
   - Foreign key constraints ensure data integrity
   - Check constraints validate data ranges
   - Unique constraints prevent duplicates

3. **Security**
   - Row Level Security (RLS) enabled on all tables
   - Role-based access control through policies
   - User-specific data isolation
