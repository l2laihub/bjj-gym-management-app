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

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

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
      try {
        setLoading(true);
        const data = await getMembers(filtersRef.current);
        
        if (mounted) {
          setMembers(data);
          setError(null);
          
          // Update cache
          membersCache.set(cacheKey, {
            data,
            timestamp: Date.now()
          });
        }
      } catch (err) {
        if (mounted) {
          console.error('Failed to load members:', err);
          setError(err instanceof Error ? err : new Error('Failed to load members'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }, DEBOUNCE_DELAY);

    return () => {
      mounted = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [user, filters]);

  return { members: members || [], loading, error };
}