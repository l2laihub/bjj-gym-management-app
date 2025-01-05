# API Documentation

## Overview

The BJJ Gym Management Application uses Supabase as its backend service. This document outlines the available API endpoints and operations implemented through the Supabase client.

## Authentication

### Sign Up
```typescript
const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  // Handle response
};
```

### Sign In
```typescript
const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  // Handle response
};
```

### Sign Out
```typescript
const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  // Handle response
};
```

## Members

### Get Members
```typescript
const getMembers = async () => {
  const { data, error } = await supabase
    .from('user_progress')
    .select(`
      *,
      user:auth.users (
        id,
        email,
        raw_user_meta_data
      )
    `);
  // Handle response
};
```

### Get Member Details
```typescript
const getMemberDetails = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_progress')
    .select(`
      *,
      user:auth.users (
        id,
        email,
        raw_user_meta_data
      )
    `)
    .eq('user_id', userId)
    .single();
  // Handle response
};
```

### Update Member Progress
```typescript
const updateMemberProgress = async (userId: string, progress: UserProgress) => {
  const { data, error } = await supabase
    .from('user_progress')
    .update(progress)
    .eq('user_id', userId);
  // Handle response
};
```

## Techniques

### Get Techniques
```typescript
const getTechniques = async () => {
  const { data, error } = await supabase
    .from('techniques')
    .select('*');
  // Handle response
};
```

### Get Techniques by Belt Level
```typescript
const getTechniquesByBelt = async (beltLevel: BeltLevel) => {
  const { data, error } = await supabase
    .from('techniques')
    .select('*')
    .eq('belt_level', beltLevel);
  // Handle response
};
```

### Add Technique (Admin Only)
```typescript
const addTechnique = async (technique: Technique) => {
  const { data, error } = await supabase
    .from('techniques')
    .insert(technique);
  // Handle response
};
```

### Update Technique (Admin Only)
```typescript
const updateTechnique = async (id: string, technique: Technique) => {
  const { data, error } = await supabase
    .from('techniques')
    .update(technique)
    .eq('id', id);
  // Handle response
};
```

## User Technique Progress

### Get User's Technique Status
```typescript
const getUserTechniqueStatus = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_technique_status')
    .select(`
      *,
      technique:techniques (*)
    `)
    .eq('user_id', userId);
  // Handle response
};
```

### Update Technique Status
```typescript
const updateTechniqueStatus = async (
  userId: string,
  techniqueId: string,
  status: TechniqueStatus
) => {
  const { data, error } = await supabase
    .from('user_technique_status')
    .upsert({
      user_id: userId,
      technique_id: techniqueId,
      status,
    });
  // Handle response
};
```

## Error Handling

All API calls should be wrapped in try-catch blocks and handle both Supabase errors and HTTP errors appropriately:

```typescript
try {
  const { data, error } = await supabaseCall();
  if (error) throw error;
  return data;
} catch (error) {
  console.error('API Error:', error);
  throw error;
}
```

## Response Types

### User Progress
```typescript
interface UserProgress {
  id: string;
  user_id: string;
  belt_rank: BeltLevel;
  stripes: number;
  months_at_current_belt: number;
  classes_attended: number;
  techniques_learned: number;
  techniques_in_progress: number;
  created_at: string;
  updated_at: string;
}
```

### Technique
```typescript
interface Technique {
  id: string;
  name: string;
  description: string;
  category: TechniqueCategory;
  belt_level: BeltLevel;
  video_url?: string;
  status: TechniqueStatus;
  created_at: string;
  updated_at: string;
}
```

### User Technique Status
```typescript
interface UserTechniqueStatus {
  id: string;
  user_id: string;
  technique_id: string;
  status: TechniqueStatus;
  created_at: string;
  updated_at: string;
  technique?: Technique;
}
```

## Best Practices

1. **Error Handling**
   - Always check for errors in Supabase responses
   - Provide meaningful error messages to users
   - Log errors for debugging

2. **Data Validation**
   - Validate data before sending to API
   - Use TypeScript interfaces for type safety
   - Implement proper error boundaries

3. **Security**
   - Never expose sensitive data
   - Validate user permissions
   - Use proper authentication headers

4. **Performance**
   - Implement proper caching strategies
   - Use optimistic updates where appropriate
   - Minimize unnecessary API calls
