import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getAttendanceStats,
  getClassSchedule,
  getRecentCheckIns,
  getAttendanceHistory,
  checkInMember,
  updateAttendance,
  deleteAttendance,
  getAttendanceByClass
} from '../lib/attendance/api';
import type {
  AttendanceStats,
  ClassScheduleItem,
  RecentCheckIn,
  AttendanceHistoryItem,
  AttendanceFilters,
  CheckInData,
  AttendanceRecord
} from '../types/attendance';

// Cache for storing attendance data
const attendanceCache = new Map<string, {
  data: unknown;
  timestamp: number;
}>();

const CACHE_TTL = 30000; // 30 seconds
const DEBOUNCE_DELAY = 300; // 300ms

function getCacheKey(key: string, params?: unknown): string {
  return `${key}:${JSON.stringify(params || {})}`;
}

/**
 * Hook for fetching attendance statistics
 */
export function useAttendanceStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AttendanceStats>({
    todaysClasses: 0,
    todaysAttendance: 0,
    averageClassSize: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  const fetchStats = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const cacheKey = getCacheKey('attendanceStats');
      
      // Check cache first
      const cached = attendanceCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        setStats(cached.data as AttendanceStats);
        setLoading(false);
        return;
      }
      
      const data = await getAttendanceStats();
      setStats(data);
      setError(null);
      retryCountRef.current = 0;
      
      // Update cache
      attendanceCache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
    } catch (err) {
      console.error('Failed to load attendance stats:', err);
      
      // Retry logic for network errors
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        const delay = Math.pow(2, retryCountRef.current) * 1000;
        console.log(`Retrying in ${delay}ms... (Attempt ${retryCountRef.current}/${maxRetries})`);
        
        setTimeout(fetchStats, delay);
        return;
      }

      setError(err instanceof Error ? err : new Error('Failed to load attendance stats'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}

/**
 * Hook for fetching class schedule
 */
export function useClassSchedule(dayOfWeek?: string) {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<ClassScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;
  
  // Use ref to track the latest day of week
  const dayOfWeekRef = useRef(dayOfWeek);
  
  useEffect(() => {
    dayOfWeekRef.current = dayOfWeek;
  }, [dayOfWeek]);

  const fetchSchedule = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const cacheKey = getCacheKey('classSchedule', { dayOfWeek: dayOfWeekRef.current });
      
      // Check cache first
      const cached = attendanceCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        setSchedule(cached.data as ClassScheduleItem[]);
        setLoading(false);
        return;
      }
      
      const data = await getClassSchedule(dayOfWeekRef.current);
      setSchedule(data);
      setError(null);
      retryCountRef.current = 0;
      
      // Update cache
      attendanceCache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
    } catch (err) {
      console.error('Failed to load class schedule:', err);
      
      // Retry logic for network errors
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        const delay = Math.pow(2, retryCountRef.current) * 1000;
        console.log(`Retrying in ${delay}ms... (Attempt ${retryCountRef.current}/${maxRetries})`);
        
        setTimeout(fetchSchedule, delay);
        return;
      }

      setError(err instanceof Error ? err : new Error('Failed to load class schedule'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule, dayOfWeek]);

  return { schedule, loading, error, refetch: fetchSchedule };
}

/**
 * Hook for fetching recent check-ins
 */
export function useRecentCheckIns(limit = 5) {
  const { user } = useAuth();
  const [checkIns, setCheckIns] = useState<RecentCheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;
  
  // Use ref to track the latest limit
  const limitRef = useRef(limit);
  
  useEffect(() => {
    limitRef.current = limit;
  }, [limit]);

  const fetchCheckIns = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const cacheKey = getCacheKey('recentCheckIns', { limit: limitRef.current });
      
      // Check cache first
      const cached = attendanceCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        setCheckIns(cached.data as RecentCheckIn[]);
        setLoading(false);
        return;
      }
      
      const data = await getRecentCheckIns(limitRef.current);
      setCheckIns(data);
      setError(null);
      retryCountRef.current = 0;
      
      // Update cache
      attendanceCache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
    } catch (err) {
      console.error('Failed to load recent check-ins:', err);
      
      // Retry logic for network errors
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        const delay = Math.pow(2, retryCountRef.current) * 1000;
        console.log(`Retrying in ${delay}ms... (Attempt ${retryCountRef.current}/${maxRetries})`);
        
        setTimeout(fetchCheckIns, delay);
        return;
      }

      setError(err instanceof Error ? err : new Error('Failed to load recent check-ins'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCheckIns();
  }, [fetchCheckIns, limit]);

  return { checkIns, loading, error, refetch: fetchCheckIns };
}

/**
 * Hook for fetching attendance history with pagination
 */
export function useAttendanceHistory(
  page = 1,
  pageSize = 10,
  filters: AttendanceFilters = {}
) {
  const { user } = useAuth();
  const [history, setHistory] = useState<AttendanceHistoryItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Use refs to track the latest params and prevent stale closures
  const filtersRef = useRef(filters);
  const pageRef = useRef(page);
  const pageSizeRef = useRef(pageSize);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  useEffect(() => {
    pageSizeRef.current = pageSize;
  }, [pageSize]);

  const fetchHistory = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const cacheKey = getCacheKey('attendanceHistory', {
        filters: filtersRef.current,
        page: pageRef.current,
        pageSize: pageSizeRef.current
      });
      
      // Check cache first
      const cached = attendanceCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        const cachedData = cached.data as { data: AttendanceHistoryItem[], count: number };
        setHistory(cachedData.data);
        setTotalCount(cachedData.count);
        setLoading(false);
        return;
      }
      
      const { data, count } = await getAttendanceHistory(
        filtersRef.current,
        pageRef.current,
        pageSizeRef.current
      );
      
      setHistory(data);
      setTotalCount(count);
      setError(null);
      retryCountRef.current = 0;
      
      // Update cache
      attendanceCache.set(cacheKey, {
        data: { data, count },
        timestamp: Date.now()
      });
    } catch (err) {
      console.error('Failed to load attendance history:', err);
      
      // Retry logic for network errors
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        const delay = Math.pow(2, retryCountRef.current) * 1000;
        console.log(`Retrying in ${delay}ms... (Attempt ${retryCountRef.current}/${maxRetries})`);
        
        timeoutRef.current = setTimeout(fetchHistory, delay);
        return;
      }

      setError(err instanceof Error ? err : new Error('Failed to load attendance history'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setHistory([]);
      setLoading(false);
      return;
    }

    let mounted = true;

    // Clear any pending timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce the API call
    timeoutRef.current = setTimeout(async () => {
      if (mounted) {
        await fetchHistory();
      }
    }, DEBOUNCE_DELAY);

    return () => {
      mounted = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [user, filters, page, pageSize, fetchHistory]);

  return {
    history,
    totalCount,
    loading,
    error,
    refetch: fetchHistory,
    totalPages: Math.ceil(totalCount / pageSize)
  };
}

/**
 * Hook for checking in a member
 */
export function useCheckIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const checkIn = async (data: CheckInData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const result = await checkInMember(data);
      
      // Clear cache for affected data
      attendanceCache.delete(getCacheKey('attendanceStats'));
      attendanceCache.delete(getCacheKey('recentCheckIns'));
      
      setSuccess(true);
      return result;
    } catch (err) {
      console.error('Error checking in member:', err);
      setError(err instanceof Error ? err : new Error('Failed to check in member'));
      throw err; // Re-throw to allow component-level error handling
    } finally {
      setLoading(false);
    }
  };

  return { checkIn, loading, error, success };
}

/**
 * Hook for managing attendance records (update/delete)
 */
export function useAttendanceManagement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateRecord = async (
    id: string,
    data: Partial<Omit<AttendanceRecord, 'id' | 'createdAt'>>
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      await updateAttendance(id, data);
      
      // Clear cache for affected data
      attendanceCache.clear(); // Clear all cache since multiple queries could be affected
      
      return true;
    } catch (err) {
      console.error('Error updating attendance record:', err);
      setError(err instanceof Error ? err : new Error('Failed to update attendance record'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await deleteAttendance(id);
      
      // Clear cache for affected data
      attendanceCache.clear(); // Clear all cache since multiple queries could be affected
      
      return true;
    } catch (err) {
      console.error('Error deleting attendance record:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete attendance record'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateRecord, deleteRecord, loading, error };
}

/**
 * Hook for fetching attendance records for a specific class
 */
export function useClassAttendance(classType: string, date: string) {
  const { user } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Use refs to track the latest params
  const classTypeRef = useRef(classType);
  const dateRef = useRef(date);
  
  useEffect(() => {
    classTypeRef.current = classType;
  }, [classType]);
  
  useEffect(() => {
    dateRef.current = date;
  }, [date]);

  const fetchAttendance = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const cacheKey = getCacheKey('classAttendance', {
        classType: classTypeRef.current,
        date: dateRef.current
      });
      
      // Check cache first
      const cached = attendanceCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        setAttendanceRecords(cached.data as AttendanceRecord[]);
        setLoading(false);
        return;
      }
      
      const data = await getAttendanceByClass(classTypeRef.current, dateRef.current);
      setAttendanceRecords(data);
      setError(null);
      
      // Update cache
      attendanceCache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
    } catch (err) {
      console.error('Failed to load class attendance:', err);
      setError(err instanceof Error ? err : new Error('Failed to load class attendance'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance, classType, date]);

  return { attendanceRecords, loading, error, refetch: fetchAttendance };
}
