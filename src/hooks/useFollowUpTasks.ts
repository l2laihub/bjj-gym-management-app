import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { getFollowUpTasks, completeFollowUpTask, createFollowUpTask } from '../lib/followUpTasks';
import type { FollowUpTask, CreateFollowUpTaskData } from '../types/prospect';

export function useFollowUpTasks() {
  const [tasks, setTasks] = useState<FollowUpTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchTasks() {
      try {
        setLoading(true);
        const data = await getFollowUpTasks();
        
        if (isMounted) {
          setTasks(data);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching follow-up tasks:', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch follow-up tasks'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchTasks();

    // Clean up previous subscription if it exists
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    // Set up real-time subscription
    const channel = supabase
      .channel('follow_up_tasks_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'follow_up_tasks' }, 
        (payload) => {
          console.log('Received task update:', payload);
          fetchTasks();
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
  }, []);

  const completeTask = async (taskId: string) => {
    try {
      await completeFollowUpTask(taskId);
      // The real-time subscription will update the tasks
    } catch (err) {
      console.error('Error completing task:', err);
      throw err;
    }
  };

  const addTask = async (task: CreateFollowUpTaskData) => {
    try {
      const newTask = await createFollowUpTask(task);
      // The real-time subscription will update the tasks
      return newTask;
    } catch (err) {
      console.error('Error adding task:', err);
      throw err;
    }
  };

  const refetch = async () => {
    setLoading(true);
    try {
      const data = await getFollowUpTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      console.error('Error refetching tasks:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch follow-up tasks'));
    } finally {
      setLoading(false);
    }
  };

  return { tasks, loading, error, completeTask, addTask, refetch };
}