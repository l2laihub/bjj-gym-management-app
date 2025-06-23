export interface AttendanceRecord {
  id: string;
  profileId: string;
  classDate: string;
  classType: string;
  instructorId?: string;
  notes?: string;
  createdAt: string;
  
  // Joined data (not in the database table)
  memberName?: string;
  instructorName?: string;
}

export interface ClassScheduleItem {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  className: string;
  classType: string;
  ageGroup: string;
  capacity: number;
  instructorId?: string;
  createdAt: string;
  updatedAt: string;
  
  // Joined data (not in the database table)
  instructorName?: string;
  attendeeCount?: number;
}

export interface AttendanceStats {
  todaysClasses: number;
  todaysAttendance: number;
  averageClassSize: number;
}

export interface AttendanceFilters {
  startDate?: string;
  endDate?: string;
  classType?: string;
  instructorId?: string;
  profileId?: string;
  search?: string;
}

export interface CheckInData {
  profileId: string;
  classType: string;
  instructorId?: string;
  notes?: string;
}

export interface RecentCheckIn {
  id: string;
  memberName: string;
  checkInTime: string;
  belt: string;
  stripes?: number;
}

export interface AttendanceHistoryItem {
  id: string;
  date: string;
  className: string;
  instructor: string;
  attendees: number;
  trend: 'up' | 'down' | 'same';
}
