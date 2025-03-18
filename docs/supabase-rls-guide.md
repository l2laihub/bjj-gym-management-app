# Supabase Row Level Security (RLS) Guide

## Overview

This document explains how Row Level Security (RLS) works in our Supabase implementation and provides solutions for common issues.

## Current Issue

The application is encountering a "403 Forbidden" error with the message "new row violates row-level security policy for table 'transactions'" when trying to insert or fetch data from the transactions table.

## Understanding Row Level Security (RLS)

Row Level Security (RLS) is a Supabase/PostgreSQL feature that restricts which rows a user can access in a database table. When RLS is enabled on a table:

1. By default, no rows are accessible (even to the table owner)
2. You must create policies that explicitly allow access to rows
3. Policies can be based on the current user, row data, or other conditions

## Solution Implemented

We've implemented a two-part solution:

### 1. Authentication Handling

- Added `ensureAuthenticated()` function to verify and establish a user session
- Added `getCurrentUserId()` function to retrieve the current user's ID

### 2. Development Mode Bypass

For development purposes, we've created a bypass mechanism:

- Created a `supabase-admin.ts` file with a client that uses service role credentials
- Added a `bypassRLS` flag that's enabled in development mode
- Updated all API functions to use the admin client when in development mode

## How to Fix RLS Issues in Production

For production, you should properly configure RLS policies in Supabase. Here's how:

1. Log into your Supabase dashboard
2. Go to the SQL Editor
3. Run the following SQL to create appropriate RLS policies:

```sql
-- First, drop any existing policies
DROP POLICY IF EXISTS "Enable all operations for authenticated users only" ON public.transaction_categories;
DROP POLICY IF EXISTS "Enable all operations for authenticated users only" ON public.transactions;

-- Create policy for transaction_categories
CREATE POLICY "Enable all operations for authenticated users only"
ON public.transaction_categories
FOR ALL
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Create policy for transactions
CREATE POLICY "Enable all operations for authenticated users only"
ON public.transactions
FOR ALL
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Make sure permissions are properly set
GRANT ALL ON public.transaction_categories TO authenticated;
GRANT ALL ON public.transactions TO authenticated;
```

## More Restrictive RLS Policies (Future Implementation)

For better security in the future, you might want to implement more restrictive policies:

```sql
-- Add a user_id column to transactions table
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Create policy that only allows users to access their own transactions
CREATE POLICY "Users can only access their own transactions"
ON public.transactions
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
```

## Troubleshooting

If you continue to experience RLS issues:

1. Check the browser console for specific error messages
2. Verify that the user is properly authenticated (check `auth.getSession()`)
3. Confirm that the RLS policies are correctly applied in Supabase
4. For development, ensure the `VITE_SUPABASE_SERVICE_ROLE_KEY` is set correctly

## References

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
