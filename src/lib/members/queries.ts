import { supabase } from '../supabase';
import type { Member, MemberFilters, MemberDetails } from '../../types/member';

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

export async function getMemberDetails(memberId: string): Promise<MemberDetails> {
  try {
    // Get emergency contact
    const { data: emergencyContacts } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('profile_id', memberId)
      .eq('is_primary', true);

    const emergencyContact = emergencyContacts?.[0];

    // Get medical info
    const { data: medicalInfos } = await supabase
      .from('medical_info')
      .select('*')
      .eq('profile_id', memberId);

    const medicalInfo = medicalInfos?.[0];

    // Get belt history
    const { data: beltHistory, error: beltError } = await supabase
      .from('belt_history')
      .select('*')
      .eq('profile_id', memberId)
      .order('promoted_at', { ascending: false });

    if (beltError) throw beltError;

    // Get recent activity (attendance)
    const { data: recentActivity, error: activityError } = await supabase
      .from('attendance')
      .select('*')
      .eq('profile_id', memberId)
      .order('class_date', { ascending: false })
      .limit(5);

    if (activityError) throw activityError;

    return {
      emergencyContact: emergencyContact ? {
        name: emergencyContact.name,
        relationship: emergencyContact.relationship,
        phone: emergencyContact.phone,
        email: emergencyContact.email,
      } : undefined,
      medicalInfo: medicalInfo ? {
        conditions: medicalInfo.conditions || [],
        allergies: medicalInfo.allergies || [],
        medications: medicalInfo.medications || [],
        bloodType: medicalInfo.blood_type,
        notes: medicalInfo.notes,
      } : undefined,
      beltHistory: beltHistory?.map(promotion => ({
        belt: promotion.belt,
        stripes: promotion.stripes,
        promotedAt: promotion.promoted_at,
        promotedBy: promotion.promoted_by,
        notes: promotion.notes,
      })),
      recentActivity: recentActivity?.map(activity => ({
        type: activity.class_type,
        date: activity.class_date,
        details: activity.notes,
      })),
    };
  } catch (error) {
    console.error('Error fetching member details:', error);
    throw new Error('Failed to fetch member details');
  }
}