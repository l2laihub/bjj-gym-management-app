import { supabase } from './supabase';
import type { FollowUpTask, CreateFollowUpTaskData } from '../types/prospect';

export async function getFollowUpTasks() {
  try {
    const { data, error } = await supabase
      .rpc('get_pending_follow_ups');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching follow-up tasks:', error);
    throw new Error('Failed to fetch follow-up tasks');
  }
}

export async function getFollowUpTasksByProspect(prospectId: string) {
  try {
    const { data, error } = await supabase
      .from('follow_up_tasks')
      .select('*')
      .eq('prospect_id', prospectId)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching follow-up tasks:', error);
    throw new Error('Failed to fetch follow-up tasks');
  }
}

export async function createFollowUpTask(data: CreateFollowUpTaskData) {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    const { data: result, error } = await supabase
      .from('follow_up_tasks')
      .insert({
        ...data,
        completed: false,
        created_by: user.user?.id
      })
      .select()
      .single();

    if (error) throw error;
    return result as FollowUpTask;
  } catch (error) {
    console.error('Error creating follow-up task:', error);
    throw new Error('Failed to create follow-up task');
  }
}

export async function completeFollowUpTask(id: string) {
  try {
    const { error } = await supabase
      .from('follow_up_tasks')
      .update({
        completed: true,
        completed_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error completing follow-up task:', error);
    throw new Error('Failed to complete follow-up task');
  }
}

export async function deleteFollowUpTask(id: string) {
  try {
    const { error } = await supabase
      .from('follow_up_tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting follow-up task:', error);
    throw new Error('Failed to delete follow-up task');
  }
}