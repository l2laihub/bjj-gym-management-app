import { supabase } from '../supabase';

export interface BeltUpdateData {
  belt: string;
  stripes: number;
  promotedBy: string;
  notes?: string;
}

export async function updateMemberBelt(memberId: string, data: BeltUpdateData) {
  try {
    const { error } = await supabase.rpc('update_member_belt', {
      p_id: memberId,
      p_belt: data.belt,
      p_stripes: data.stripes,
      p_promoted_by: data.promotedBy,
      p_notes: data.notes
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error updating member belt:', error);
    throw new Error('Failed to update member belt');
  }
}