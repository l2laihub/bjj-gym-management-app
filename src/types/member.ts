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

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface MedicalInfo {
  conditions: string[];
  allergies: string[];
  medications: string[];
  bloodType?: string;
  notes?: string;
}

export interface BeltPromotion {
  belt: string;
  stripes: number;
  promotedAt: string;
  promotedBy: string;
  notes?: string;
}

export interface ActivityRecord {
  type: string;
  date: string;
  details?: string;
}

export interface MemberDetails {
  emergencyContact?: EmergencyContact;
  medicalInfo?: MedicalInfo;
  beltHistory?: BeltPromotion[];
  recentActivity?: ActivityRecord[];
}