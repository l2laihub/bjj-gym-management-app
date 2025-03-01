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
        // Get user roles
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role_id')
          .eq('user_id', user.id);

        if (rolesError) {
          // Handle specific error cases
          if (rolesError.code === 'PGRST116') {
            // No roles found - assign default member role
            const { error: insertError } = await supabase
              .from('user_roles')
              .insert([{ user_id: user.id, role_id: 'member' }]);

            if (insertError) throw insertError;
            setRoles(['member']);
          } else {
            throw rolesError;
          }
        } else {
          setRoles(userRoles?.map(r => r.role_id as Role) || ['member']);
        }

        setError(null);
      } catch (err) {
        console.error('Error loading roles:', err);
        // Set default role on error to prevent lockout
        setRoles(['member']);
        setError(err instanceof Error ? err : new Error('Failed to load roles'));
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