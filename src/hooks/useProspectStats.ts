import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { getProspectStats } from '../lib/prospects';
import type { ProspectStats } from '../types/prospect';

export function useProspectStats() {
  const [stats, setStats] = useState<ProspectStats>({
    active_prospects: 0,
    conversion_rate: 0,
    high_interest: 0,
    pending_follow_ups: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const subscriptionsRef = useRef<{ unsubscribe: () => void }[]>([]);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchStats() {
      try {
        setLoading(true);
        console.log('Fetching prospect stats in hook...');
        const data = await getProspectStats();
        
        if (isMounted) {
          console.log('Setting stats in hook:', data);
          setStats(data);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching prospect stats in hook:', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch prospect statistics'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchStats();

    // Clean up previous subscriptions
    subscriptionsRef.current.forEach(subscription => subscription.unsubscribe());
    subscriptionsRef.current = [];

    // Set up real-time subscription for prospects table
    const prospectChannel = supabase
      .channel('prospect_stats_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'prospects' }, 
        () => {
          console.log('Prospect change detected, updating stats');
          fetchStats();
        }
      )
      .subscribe();
    
    subscriptionsRef.current.push(prospectChannel);

    // Set up real-time subscription for follow_up_tasks table
    const taskChannel = supabase
      .channel('task_stats_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'follow_up_tasks' }, 
        () => {
          console.log('Task change detected, updating stats');
          fetchStats();
        }
      )
      .subscribe();
    
    subscriptionsRef.current.push(taskChannel);

    return () => {
      isMounted = false;
      subscriptionsRef.current.forEach(subscription => subscription.unsubscribe());
    };
  }, []);

  const refetch = async () => {
    setLoading(true);
    try {
      console.log('Refetching prospect stats...');
      const data = await getProspectStats();
      console.log('Refetched stats:', data);
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Error refetching stats:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch prospect statistics'));
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, error, refetch };
}