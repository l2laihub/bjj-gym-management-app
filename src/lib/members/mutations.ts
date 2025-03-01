import { supabase } from '../supabase';
import type { Member, EmergencyContact, MedicalInfo } from '../../types/member';
import { updateBelt } from './belt';

export interface CreateMemberData extends Omit<Member, 'id' | 'roles'> {}
export interface UpdateMemberData extends Partial<Member> {}

export async function createMember(data: CreateMemberData) {
  try {
    // Validate input data
    if (!data.email || !data.fullName) {
      throw new Error('Email and full name are required');
    }

    // Create member profile using stored procedure
    const { data: result, error: createError } = await supabase.rpc('create_member_profile', {
      p_email: data.email,
      p_full_name: data.fullName,
      p_belt: data.belt || 'white',
      p_stripes: data.stripes || 0,
      p_status: data.status || 'active'
    });

    if (createError) {
      console.error('Database error creating member:', createError);
      
      // Handle specific error cases
      if (createError.message.includes('already exists')) {
        throw new Error('A member with this email already exists');
      }
      if (createError.code === '42501') {
        throw new Error('You do not have permission to create members');
      }
      if (createError.code === '23505') {
        throw new Error('A member with this email already exists');
      }
      
      // Log detailed error for debugging
      console.error('Create member error details:', {
        code: createError.code,
        message: createError.message,
        details: createError.details,
        hint: createError.hint
      });
      
      throw new Error('Failed to create member. Please try again.');
    }

    if (!result) {
      console.error('No result returned from create_member_profile');
      throw new Error('Failed to create member. Please try again.');
    }

    return result;
  } catch (error) {
    // Log the full error for debugging
    console.error('Error in createMember:', error);
    
    // Re-throw specific error messages
    if (error instanceof Error) {
      throw error;
    }
    
    // Fallback error
    throw new Error('Failed to create member. Please try again.');
  }
}

export async function updateMember(id: string, data: UpdateMemberData) {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: data.fullName,
        status: data.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating member:', error);
    throw new Error('Failed to update member');
  }
}

export async function updateMemberBelt(id: string, data: { belt: string; stripes: number }) {
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    throw new Error('Not authenticated');
  }

  return updateBelt(id, {
    belt: data.belt,
    stripes: data.stripes,
    promotedBy: user.data.user.id,
    notes: 'Belt promotion'
  });
}

export async function upsertEmergencyContact(memberId: string, data: EmergencyContact) {
  try {
    // First, delete any existing primary contacts for this member
    const { error: deleteError } = await supabase
      .from('emergency_contacts')
      .delete()
      .eq('profile_id', memberId)
      .eq('is_primary', true);

    if (deleteError) throw deleteError;

    // Then insert the new contact
    const { error: insertError } = await supabase
      .from('emergency_contacts')
      .insert({
        profile_id: memberId,
        name: data.name,
        relationship: data.relationship,
        phone: data.phone,
        email: data.email,
        is_primary: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (insertError) throw insertError;
  } catch (error) {
    console.error('Error upserting emergency contact:', error);
    throw new Error('Failed to save emergency contact');
  }
}

export async function upsertMedicalInfo(memberId: string, data: MedicalInfo) {
  try {
    // First, delete any existing medical info for this member
    const { error: deleteError } = await supabase
      .from('medical_info')
      .delete()
      .eq('profile_id', memberId);

    if (deleteError) throw deleteError;

    // Then insert the new medical info
    const { error: insertError } = await supabase
      .from('medical_info')
      .insert({
        profile_id: memberId,
        conditions: data.conditions,
        allergies: data.allergies,
        medications: data.medications,
        blood_type: data.bloodType,
        notes: data.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (insertError) throw insertError;
  } catch (error) {
    console.error('Error upserting medical info:', error);
    throw new Error('Failed to save medical information');
  }
}

export async function deleteMember(id: string) {
  try {
    const { error } = await supabase.rpc('delete_member', {
      member_id: id
    });

    if (error) {
      console.error('Error deleting member:', error);
      
      // Handle specific error cases
      if (error.code === '42501') { // Permission denied
        throw new Error('You do not have permission to delete members');
      } else if (error.code === '42704') { // Member not found
        throw new Error('Member not found or already deleted');
      }
      
      throw new Error('Failed to delete member. Please try again later.');
    }
  } catch (error) {
    console.error('Error deleting member:', error);
    throw error;
  }
}