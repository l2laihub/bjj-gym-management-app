export type Role = 'admin' | 'member';

export interface UserProfile {
  id: string;
  full_name: string;
  created_at: string;
  updated_at: string;
  roles: Role[];
}