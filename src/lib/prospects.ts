import { supabase } from './supabase';
import type { Prospect, CreateProspectData, UpdateProspectData, ProspectStats } from '../types/prospect';

export async function getProspects(filters: {
  status?: string;
  interestLevel?: string;
  search?: string;
} = {}) {
  try {
    const { data, error } = await supabase
      .rpc('get_prospects', {
        status_filter: filters.status || null,
        interest_filter: filters.interestLevel || null,
        search_term: filters.search || null
      });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching prospects:', error);
    throw new Error('Failed to fetch prospects');
  }
}

export async function getProspectById(id: string) {
  try {
    const { data, error } = await supabase
      .from('prospects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Prospect;
  } catch (error) {
    console.error('Error fetching prospect:', error);
    throw new Error('Failed to fetch prospect');
  }
}

export async function createProspect(data: CreateProspectData) {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    const { data: result, error } = await supabase
      .from('prospects')
      .insert({
        ...data,
        created_by: user.user?.id
      })
      .select()
      .single();

    if (error) throw error;
    return result as Prospect;
  } catch (error) {
    console.error('Error creating prospect:', error);
    throw new Error('Failed to create prospect');
  }
}

export async function updateProspect(id: string, data: UpdateProspectData) {
  try {
    const { error } = await supabase
      .from('prospects')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating prospect:', error);
    throw new Error('Failed to update prospect');
  }
}

export async function deleteProspect(id: string) {
  try {
    const { error } = await supabase
      .from('prospects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting prospect:', error);
    throw new Error('Failed to delete prospect');
  }
}

export async function getProspectStats(): Promise<ProspectStats> {
  try {
    console.log('Fetching prospect stats...');
    const { data, error } = await supabase
      .rpc('get_prospect_stats');

    if (error) {
      console.error('Supabase error fetching prospect stats:', error);
      throw error;
    }
    
    console.log('Prospect stats received:', data);
    
    // Handle case where data is an array with one object
    const statsData = Array.isArray(data) ? data[0] : data;
    console.log('Processed stats data:', statsData);
    
    // Ensure all fields are present and have proper types
    const formattedData: ProspectStats = {
      active_prospects: Number(statsData?.active_prospects || 0),
      conversion_rate: Number(statsData?.conversion_rate || 0),
      high_interest: Number(statsData?.high_interest || 0),
      pending_follow_ups: Number(statsData?.pending_follow_ups || 0)
    };
    
    console.log('Formatted stats data:', formattedData);
    return formattedData;
  } catch (error) {
    console.error('Error fetching prospect stats:', error);
    throw new Error('Failed to fetch prospect statistics');
  }
}