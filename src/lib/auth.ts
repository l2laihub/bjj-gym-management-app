import { supabase } from './supabase';

export async function signInWithEmail(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signUpWithEmail(email: string, password: string, fullName: string) {
  try {
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError || !user) {
      throw signUpError || new Error('Signup failed');
    }

    return user;
  } catch (error) {
    console.error('Auth signup error:', error);
    throw error;
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}