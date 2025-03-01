export interface Prospect {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  source: string;
  interest_level: 'High' | 'Medium' | 'Low';
  trial_package: string;
  first_contact: string;
  next_follow_up: string;
  notes: string;
  status: 'Initial Contact' | 'Trial Scheduled' | 'Trial Active' | 'Converted' | 'Lost';
  created_at: string;
  updated_at: string;
  created_by: string;
}

export type CreateProspectData = Omit<Prospect, 'id' | 'created_at' | 'updated_at' | 'created_by'>;
export type UpdateProspectData = Partial<CreateProspectData>;

export interface ProspectFilters {
  status?: string;
  interestLevel?: string;
  search?: string;
}

export interface FollowUpTask {
  id: string;
  prospect_id: string;
  type: 'call' | 'email' | 'meeting' | 'other';
  due_date: string;
  notes: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export type CreateFollowUpTaskData = Omit<FollowUpTask, 'id' | 'created_at' | 'updated_at' | 'completed' | 'completed_at' | 'created_by'>;

export interface ProspectStats {
  active_prospects: number;
  conversion_rate: number;
  high_interest: number;
  pending_follow_ups: number;
}