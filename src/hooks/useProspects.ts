import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { getProspects } from '../lib/prospects';
import type { Prospect, ProspectFilters } from '../types/prospect';

export function useProspects(filters: ProspectFilters = {}) {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchProspects() {
      try {
        setLoading(true);
        const data = await getProspects(filters);
        
        if (isMounted) {
          setProspects(data);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching prospects:', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch prospects'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProspects();

    // Clean up previous subscription if it exists
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    // Set up real-time subscription
    const channel = supabase
      .channel('prospects_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'prospects' }, 
        (payload) => {
          console.log('Received real-time update:', payload);
          fetchProspects();
        }
      )
      .subscribe();
    
    subscriptionRef.current = channel;

    return () => {
      isMounted = false;
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [JSON.stringify(filters)]); // Stringify filters to ensure proper dependency tracking

  const refetch = async () => {
    setLoading(true);
    try {
      const data = await getProspects(filters);
      setProspects(data);
      setError(null);
    } catch (err) {
      console.error('Error refetching prospects:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch prospects'));
    } finally {
      setLoading(false);
    }
  };

  return { prospects, loading, error, refetch };
}