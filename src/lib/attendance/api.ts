import { supabase, ensureAuthenticated } from '../supabase';
import {
  AttendanceRecord,
  ClassScheduleItem,
  AttendanceStats,
  AttendanceFilters,
  CheckInData,
  RecentCheckIn,
  AttendanceHistoryItem
} from '../../types/attendance';

/**
 * Fetch attendance statistics
 * @returns Promise with attendance statistics
 */
export async function getAttendanceStats(): Promise<AttendanceStats> {
  try {
    await ensureAuthenticated();
    
    // Get today's date in ISO format
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();
    
    // Get today's classes count - count distinct class types
    const { data: classesData, error: classesError } = await supabase
      .from('attendance')
      .select('class_type')
      .gte('class_date', startOfDay)
      .lte('class_date', endOfDay);
    
    if (classesError) throw classesError;
    
    // Count unique class types
    const uniqueClassTypes = new Set();
    (classesData || []).forEach(item => {
      if (item.class_type) {
        uniqueClassTypes.add(item.class_type);
      }
    });
    const todaysClassesCount = uniqueClassTypes.size;
    
    // Get today's attendance count
    const { count: todaysAttendanceCount, error: attendanceError } = await supabase
      .from('attendance')
      .select('*', { count: 'exact', head: true })
      .gte('class_date', startOfDay)
      .lte('class_date', endOfDay);
    
    if (attendanceError) throw attendanceError;
    
    // Get average class size
    const { data: avgClassSizeData, error: avgClassSizeError } = await supabase
      .rpc('get_average_class_size');
    
    if (avgClassSizeError) throw avgClassSizeError;
    
    return {
      todaysClasses: todaysClassesCount || 0,
      todaysAttendance: todaysAttendanceCount || 0,
      averageClassSize: avgClassSizeData || 0
    };
  } catch (error) {
    console.error('Error fetching attendance stats:', error);
    // Return default values if there's an error
    return {
      todaysClasses: 0,
      todaysAttendance: 0,
      averageClassSize: 0
    };
  }
}

/**
 * Fetch class schedule for a specific day
 * @param dayOfWeek Day of the week (e.g., 'Monday')
 * @returns Promise with class schedule items
 */
export async function getClassSchedule(dayOfWeek?: string): Promise<ClassScheduleItem[]> {
  try {
    await ensureAuthenticated();
    
    let query = supabase
      .from('class_schedule')
      .select(`
        *,
        instructor:profiles(full_name)
      `);
    
    // Filter by day of week if provided
    if (dayOfWeek) {
      query = query.eq('day_of_week', dayOfWeek);
    }
    
    // Order by start time
    query = query.order('start_time');
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return (data || []).map(item => ({
      id: item.id,
      dayOfWeek: item.day_of_week,
      startTime: item.start_time,
      endTime: item.end_time,
      className: item.class_name,
      classType: item.class_type,
      ageGroup: item.age_group,
      capacity: item.capacity,
      instructorId: item.instructor_id,
      instructorName: item.instructor?.full_name,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  } catch (error) {
    console.error('Error fetching class schedule:', error);
    return [];
  }
}

/**
 * Fetch recent check-ins
 * @param limit Number of recent check-ins to fetch
 * @returns Promise with recent check-ins
 */
export async function getRecentCheckIns(limit = 5): Promise<RecentCheckIn[]> {
  try {
    await ensureAuthenticated();
    
    // First get the attendance records
    const { data: attendanceData, error: attendanceError } = await supabase
      .from('attendance')
      .select('id, class_date, profile_id')
      .order('class_date', { ascending: false })
      .limit(limit);
    
    if (attendanceError) throw attendanceError;
    
    if (!attendanceData || attendanceData.length === 0) {
      return [];
    }
    
    // Then get the profile data for each attendance record
    const profileIds = attendanceData.map(item => item.profile_id).filter(Boolean);
    
    if (profileIds.length === 0) {
      return attendanceData.map(item => ({
        id: String(item.id || ''),
        memberName: 'Unknown',
        checkInTime: String(item.class_date || ''),
        belt: 'white',
        stripes: 0
      }));
    }
    
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, belt, stripes')
      .in('id', profileIds);
    
    if (profilesError) throw profilesError;
    
    // Map the profiles to the attendance records
    return attendanceData.map(item => {
      const profile = profilesData?.find(p => p.id === item.profile_id);
      
      return {
        id: String(item.id || ''),
        memberName: profile ? String(profile.full_name || '') : 'Unknown',
        checkInTime: String(item.class_date || ''),
        belt: profile ? String(profile.belt || 'white') : 'white',
        stripes: profile ? Number(profile.stripes || 0) : 0
      };
    });
  } catch (error) {
    console.error('Error fetching recent check-ins:', error);
    return [];
  }
}

/**
 * Fetch attendance history
 * @param filters Filters for attendance history
 * @param page Page number for pagination
 * @param pageSize Number of items per page
 * @returns Promise with attendance history items
 */
export async function getAttendanceHistory(
  filters: AttendanceFilters = {},
  page = 1,
  pageSize = 10
): Promise<{ data: AttendanceHistoryItem[], count: number }> {
  try {
    await ensureAuthenticated();
    
    // Calculate range for pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    // First, get the distinct class sessions
    let query = supabase
      .from('attendance')
      .select(`
        id,
        class_date,
        class_type,
        instructor_id
      `, { count: 'exact' });
    
    // Apply filters
    if (filters.startDate) {
      query = query.gte('class_date', filters.startDate);
    }
    
    if (filters.endDate) {
      query = query.lte('class_date', filters.endDate);
    }
    
    if (filters.classType) {
      query = query.eq('class_type', filters.classType);
    }
    
    if (filters.instructorId) {
      query = query.eq('instructor_id', filters.instructorId);
    }
    
    // Order by date (most recent first)
    query = query.order('class_date', { ascending: false });
    
    // Apply pagination
    query = query.range(from, to);
    
    const { data, count, error } = await query;
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return { data: [], count: 0 };
    }
    
    // Get instructor names
    const instructorIds = data.map(item => item.instructor_id).filter(Boolean);
    let instructors: Record<string, string> = {};
    
    if (instructorIds.length > 0) {
      const { data: instructorData, error: instructorError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', instructorIds);
      
      if (!instructorError && instructorData) {
        instructors = instructorData.reduce((acc, curr) => {
          acc[curr.id] = curr.full_name;
          return acc;
        }, {} as Record<string, string>);
      }
    }
    
    // Get attendee counts for each class
    const classIds = data.map(item => item.id);
    const attendeeCounts: Record<string, number> = {};
    
    for (const classId of classIds) {
      const { count: attendeeCount } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .eq('id', classId);
      
      attendeeCounts[classId] = attendeeCount || 0;
    }
    
    // Transform data to match our interface
    const historyItems: AttendanceHistoryItem[] = data.map(item => {
      // Calculate trend (this is a placeholder - in a real app, you'd compare with previous periods)
      const trend: 'up' | 'down' | 'same' = Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'same' : 'down';
      
      return {
        id: String(item.id || ''),
        date: String(item.class_date || ''),
        className: String(item.class_type || ''),
        instructor: instructors[item.instructor_id] || 'Unknown',
        attendees: attendeeCounts[item.id] || 0,
        trend
      };
    });
    
    return {
      data: historyItems,
      count: count || 0
    };
  } catch (error) {
    console.error('Error fetching attendance history:', error);
    return {
      data: [],
      count: 0
    };
  }
}

/**
 * Check in a member to a class
 * @param data Check-in data
 * @returns Promise with the created attendance record
 */
export async function checkInMember(data: CheckInData): Promise<AttendanceRecord | null> {
  try {
    await ensureAuthenticated();
    
    const now = new Date().toISOString();
    
    // Get current user session
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    if (!userId) {
      console.error('No authenticated user found');
      throw new Error('Authentication required');
    }
    
    // First check if the user has already checked in to this class type today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const { data: existingCheckIns, error: checkError } = await supabase
      .from('attendance')
      .select('*')
      .eq('profile_id', data.profileId)
      .eq('class_type', data.classType)
      .gte('class_date', startOfDay.toISOString())
      .lte('class_date', endOfDay.toISOString());
    
    if (checkError) {
      console.error('Error checking existing check-ins:', checkError);
      throw checkError;
    }
    
    // If already checked in, return the existing record
    if (existingCheckIns && existingCheckIns.length > 0) {
      const existing = existingCheckIns[0];
      console.log('User already checked in to this class today:', existing);
      
      return {
        id: existing.id,
        profileId: existing.profile_id,
        classDate: existing.class_date,
        classType: existing.class_type,
        instructorId: existing.instructor_id,
        notes: existing.notes || `Already checked in earlier`,
        createdAt: existing.created_at
      };
    }
    
    // Check if the user is checking in for themselves or if they're an admin
    if (userId !== data.profileId) {
      // Check if the user is an admin
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin');
      
      if (rolesError) {
        console.error('Error checking user roles:', rolesError);
        throw rolesError;
      }
      
      // If not an admin, they can't check in for someone else
      if (!roles || roles.length === 0) {
        throw new Error('Permission denied: You can only check in for yourself unless you are an admin.');
      }
    }
    
    // Insert the attendance record
    const { data: insertedData, error } = await supabase
      .from('attendance')
      .insert({
        profile_id: data.profileId,
        class_date: now,
        class_type: data.classType,
        instructor_id: data.instructorId,
        notes: data.notes
      })
      .select()
      .single();
    
    if (error) {
      console.error('Insert error details:', error);
      
      // Handle specific error cases
      if (error.code === '42501') {
        throw new Error('Permission denied: You do not have access to check in. Please contact an administrator.');
      } else if (error.message.includes('violates row-level security policy')) {
        // Try to provide more helpful information about RLS issues
        throw new Error('Access denied: Your account does not have permission to check in. This might be due to your membership status or account settings. Please contact an administrator.');
      }
      
      throw error;
    }
    
    if (!insertedData) return null;
    
    return {
      id: insertedData.id,
      profileId: insertedData.profile_id,
      classDate: insertedData.class_date,
      classType: insertedData.class_type,
      instructorId: insertedData.instructor_id,
      notes: insertedData.notes,
      createdAt: insertedData.created_at
    };
  } catch (error) {
    console.error('Error checking in member:', error);
    throw error; // Re-throw the error so we can handle it in the UI
  }
}

/**
 * Update an attendance record
 * @param id Attendance record ID
 * @param data Updated attendance data
 * @returns Promise with the updated attendance record
 */
export async function updateAttendance(
  id: string,
  data: Partial<Omit<AttendanceRecord, 'id' | 'createdAt'>>
): Promise<AttendanceRecord | null> {
  try {
    await ensureAuthenticated();
    
    // Convert from camelCase to snake_case for database
    const dbData: Record<string, unknown> = {};
    
    if (data.profileId) dbData.profile_id = data.profileId;
    if (data.classDate) dbData.class_date = data.classDate;
    if (data.classType) dbData.class_type = data.classType;
    if (data.instructorId) dbData.instructor_id = data.instructorId;
    if (data.notes !== undefined) dbData.notes = data.notes;
    
    const { data: updatedData, error } = await supabase
      .from('attendance')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    if (!updatedData) return null;
    
    return {
      id: updatedData.id,
      profileId: updatedData.profile_id,
      classDate: updatedData.class_date,
      classType: updatedData.class_type,
      instructorId: updatedData.instructor_id,
      notes: updatedData.notes,
      createdAt: updatedData.created_at
    };
  } catch (error) {
    console.error('Error updating attendance record:', error);
    return null;
  }
}

/**
 * Delete an attendance record
 * @param id Attendance record ID
 * @returns Promise with success status
 */
export async function deleteAttendance(id: string): Promise<boolean> {
  try {
    await ensureAuthenticated();
    
    const { error } = await supabase
      .from('attendance')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting attendance record:', error);
    return false;
  }
}

/**
 * Get attendance records for a specific class
 * @param classType Class type
 * @param date Date for the class
 * @returns Promise with attendance records
 */
export async function getAttendanceByClass(
  classType: string,
  date: string
): Promise<AttendanceRecord[]> {
  try {
    await ensureAuthenticated();
    
    // Parse the date and create start/end of day
    const parsedDate = new Date(date);
    const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999)).toISOString();
    
    // Get attendance records
    const { data: attendanceData, error: attendanceError } = await supabase
      .from('attendance')
      .select('*')
      .eq('class_type', classType)
      .gte('class_date', startOfDay)
      .lte('class_date', endOfDay);
    
    if (attendanceError) throw attendanceError;
    
    if (!attendanceData || attendanceData.length === 0) {
      return [];
    }
    
    // Get profile IDs
    const profileIds = attendanceData
      .map(item => item.profile_id)
      .filter(Boolean);
    
    const instructorIds = attendanceData
      .map(item => item.instructor_id)
      .filter(Boolean);
    
    // Get all unique profile IDs
    const allProfileIds = [...new Set([...profileIds, ...instructorIds])];
    
    // Get profile data
    let profiles: Record<string, { full_name: string }> = {};
    
    if (allProfileIds.length > 0) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', allProfileIds);
      
      if (!profileError && profileData) {
        profiles = profileData.reduce((acc, curr) => {
          acc[curr.id] = { full_name: curr.full_name };
          return acc;
        }, {} as Record<string, { full_name: string }>);
      }
    }
    
    // Map attendance records with profile data
    return attendanceData.map(item => {
      const memberName = item.profile_id && profiles[item.profile_id] 
        ? profiles[item.profile_id].full_name 
        : undefined;
        
      const instructorName = item.instructor_id && profiles[item.instructor_id] 
        ? profiles[item.instructor_id].full_name 
        : undefined;
      
      return {
        id: String(item.id || ''),
        profileId: String(item.profile_id || ''),
        classDate: String(item.class_date || ''),
        classType: String(item.class_type || ''),
        instructorId: String(item.instructor_id || ''),
        notes: item.notes,
        createdAt: String(item.created_at || ''),
        memberName,
        instructorName
      };
    });
  } catch (error) {
    console.error('Error fetching class attendance:', error);
    return [];
  }
}
