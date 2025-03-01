import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getMembers } from '../lib/members';
import type { Member, MemberFilters } from '../types/member';

// Cache for storing member data
const membersCache = new Map<string, {
  data: Member[];
  timestamp: number;
}>();

const CACHE_TTL = 30000; // 30 seconds
const DEBOUNCE_DELAY = 300; // 300ms

function getCacheKey(filters: MemberFilters): string {
  return JSON.stringify(filters);
}

export function useMembers(filters: MemberFilters = {}) {
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Use refs to track the latest filters and prevent stale closures
  const filtersRef = useRef(filters);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const fetchMembers = async () => {
    if (!user) {
      setMembers([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getMembers(filtersRef.current);
      setMembers(data);
      setError(null);
      retryCountRef.current = 0;
      
      // Update cache
      membersCache.set(getCacheKey(filtersRef.current), {
        data,
        timestamp: Date.now()
      });
    } catch (err) {
      console.error('Failed to load members:', err);
      
      // Retry logic for network errors
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        const delay = Math.pow(2, retryCountRef.current) * 1000;
        console.log(`Retrying in ${delay}ms... (Attempt ${retryCountRef.current}/${maxRetries})`);
        
        timeoutRef.current = setTimeout(fetchMembers, delay);
        return;
      }

      setError(err instanceof Error ? err : new Error('Failed to load members'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setMembers([]);
      setLoading(false);
      return;
    }

    let mounted = true;
    const cacheKey = getCacheKey(filters);

    // Clear any pending timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Check cache first
    const cached = membersCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setMembers(cached.data);
      setLoading(false);
      return;
    }

    // Debounce the API call
    timeoutRef.current = setTimeout(async () => {
      if (mounted) {
        await fetchMembers();
      }
    }, DEBOUNCE_DELAY);

    return () => {
      mounted = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [user, filters]);

  return { members, loading, error, refetch: fetchMembers };
}