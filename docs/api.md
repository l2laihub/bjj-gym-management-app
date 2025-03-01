# API Documentation

## Table of Contents
- [Overview](#overview)
- [Authentication](#authentication)
  - [Sign Up](#sign-up)
  - [Sign In](#sign-in)
  - [Sign Out](#sign-out)
- [Members](#members)
  - [Get Members](#get-members)
  - [Get Member Details](#get-member-details)
  - [Update Member Progress](#update-member-progress)
- [Techniques](#techniques)
  - [Get Techniques](#get-techniques)
  - [Get Techniques by Belt Level](#get-techniques-by-belt-level)
  - [Add Technique](#add-technique)
  - [Update Technique](#update-technique)
- [User Technique Progress](#user-technique-progress)
  - [Get User's Technique Status](#get-users-technique-status)
  - [Update Technique Status](#update-technique-status)
- [Error Handling](#error-handling)
- [Response Types](#response-types)
- [Best Practices](#best-practices)
- [Rate Limits](#rate-limits)
- [Authentication Requirements](#authentication-requirements)

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

## Rate Limits

- **Authentication Endpoints**: 10 requests per minute
- **Read Operations**: 60 requests per minute
- **Write Operations**: 30 requests per minute

Exceeding rate limits will result in a `429 Too Many Requests` response.

## Authentication Requirements

| Endpoint | Authentication Required | Permissions |
|----------|-------------------------|-------------|
| Sign Up | No | None |
| Sign In | No | None |
| Sign Out | Yes | Authenticated |
| Get Members | Yes | Authenticated |
| Get Member Details | Yes | Authenticated |
| Update Member Progress | Yes | Admin |
| Get Techniques | Yes | Authenticated |
| Get Techniques by Belt Level | Yes | Authenticated |
| Add Technique | Yes | Admin |
| Update Technique | Yes | Admin |
| Get User's Technique Status | Yes | Authenticated |
| Update Technique Status | Yes | Admin |

## Error Handling

### Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server-side error |

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
