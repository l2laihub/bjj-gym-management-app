import { supabase } from '../supabase';
import type { Member, MemberFilters } from '../../types/member';

export async function getMembers(filters: MemberFilters = {}): Promise<Member[]> {
  try {
    const { data, error } = await supabase.rpc('get_members', {
      status_filter: filters.status || null,
      belt_filter: filters.belt || null,
      name_search: filters.search || null
    });

    if (error) {
      console.error('Database error:', error);
      throw new Error('Failed to fetch members');
    }

    return (data || []).map(member => ({
      id: member.id,
      fullName: member.full_name,
      email: member.email || '',
      belt: member.belt || 'white',
      stripes: member.stripes || 0,
      status: member.status || 'active',
      joinDate: member.created_at,
      lastActive: member.updated_at,
      roles: member.roles || []
    }));
  } catch (error) {
    console.error('Error fetching members:', error);
    throw new Error('Failed to fetch members');
  }
}