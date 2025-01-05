export interface Member {
  id: string;
  fullName: string;
  email: string;
  belt?: string;
  stripes?: number;
  joinDate: string;
  lastActive?: string;
  status: 'active' | 'inactive';
  roles: string[];
}

export interface MemberFilters {
  status?: 'active' | 'inactive';
  belt?: string;
  search?: string;
}