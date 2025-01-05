import { supabase } from '../supabase';
import type { Member } from '../../types/member';

export interface CreateMemberData extends Omit<Member, 'id' | 'roles'> {}
export interface UpdateMemberData extends Partial<Member> {}

export async function createMember(data: CreateMemberData) {
  try {
    const { error } = await supabase.rpc('create_member', {
      p_full_name: data.fullName,
      p_belt: data.belt || 'white',
      p_stripes: data.stripes || 0,
      p_status: data.status || 'active'
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error creating member:', error);
    throw new Error('Failed to create member');
  }
}

export async function updateMember(id: string, data: UpdateMemberData) {
  try {
    const { error } = await supabase.rpc('update_member', {
      p_id: id,
      p_full_name: data.fullName,
      p_status: data.status
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error updating member:', error);
    throw new Error('Failed to update member');
  }
}

export async function deleteMember(id: string) {
  try {
    const { error } = await supabase.rpc('delete_member', {
      p_id: id
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting member:', error);
    throw new Error('Failed to delete member');
  }
}