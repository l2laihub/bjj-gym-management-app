import { supabase } from './supabase';

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