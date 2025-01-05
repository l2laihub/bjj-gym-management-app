import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Role } from '../types/auth';

export function useRoles() {
  const { user } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadRoles() {
      if (!user) {
        setRoles([]);
        setLoading(false);
        return;
      }

      try {
        // First check if user has a profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        // Then get user roles
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role_id')
          .eq('user_id', user.id);

        if (rolesError) throw rolesError;

        if (!userRoles?.length) {
          // If no roles found, assign default member role
          const { error: insertError } = await supabase
            .from('user_roles')
            .insert([{ user_id: user.id, role_id: 'member' }]);

          if (insertError) throw insertError;
          
          setRoles(['member']);
        } else {
          setRoles(userRoles.map(r => r.role_id as Role));
        }

        setError(null);
      } catch (err) {
        console.error('Error loading roles:', err);
        setError(err instanceof Error ? err : new Error('Failed to load roles'));
        setRoles([]);
      } finally {
        setLoading(false);
      }
    }

    loadRoles();
  }, [user]);

  return {
    roles,
    isAdmin: roles.includes('admin'),
    isMember: roles.includes('member'),
    loading,
    error
  };
}