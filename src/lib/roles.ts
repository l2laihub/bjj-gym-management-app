import { supabase } from './supabase';

export async function assignMemberRole(userId: string) {
  const { error } = await supabase
    .from('user_roles')
    .insert([{
      user_id: userId,
      role_id: 'member'
    }]);

  if (error) {
    console.error('Role assignment error:', error);
    throw new Error('Failed to assign role');
  }
}