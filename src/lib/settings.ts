import { supabase } from './supabase';

export async function updatePassword(currentPassword: string, newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error updating password:', error);
    throw new Error('Failed to update password');
  }
}

export async function updateTwoFactorAuth(enabled: boolean) {
  try {
    // Note: This is a placeholder for future 2FA implementation
    // Supabase currently doesn't support 2FA through their API
    throw new Error('Two-factor authentication is not yet supported');
  } catch (error) {
    console.error('Error updating 2FA:', error);
    throw error;
  }
}

export async function getActiveSessions() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session ? [session] : [];
  } catch (error) {
    console.error('Error getting sessions:', error);
    throw new Error('Failed to get active sessions');
  }
}

export async function signOutFromAllSessions() {
  try {
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    if (error) throw error;
  } catch (error) {
    console.error('Error signing out from all sessions:', error);
    throw new Error('Failed to sign out from all sessions');
  }
}