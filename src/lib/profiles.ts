import { supabase } from './supabase';
import type { UserProfile } from '../types/auth';

export async function createProfile(userId: string, fullName: string) {
  const { error } = await supabase
    .from('profiles')
    .insert([{
      id: userId,
      full_name: fullName,
    }]);

  if (error) {
    console.error('Profile creation error:', error);
    throw new Error('Failed to create profile');
  }
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as UserProfile;
}

export async function updateProfile(userId: string, updates: Partial<UserProfile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as UserProfile;
}

export async function updateUserMetadata(updates: Record<string, any>) {
  const { data: { user }, error } = await supabase.auth.updateUser({
    data: updates
  });

  if (error) throw error;
  return user;
}