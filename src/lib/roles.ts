import { supabase } from './supabase';

export async function assignMemberRole(userId: string) {
  // First check if the role is already assigned
  const { data: existingRole } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', userId)
    .eq('role_id', 'member')
    .single();

  // Only insert if the role doesn't already exist
  if (!existingRole) {
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
}