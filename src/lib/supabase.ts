import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with retries
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
  global: {
    fetch: async (...args) => {
      const maxRetries = 3;
      let lastError;

      for (let i = 0; i < maxRetries; i++) {
        try {
          return await fetch(...args);
        } catch (err) {
          lastError = err;
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
      }

      console.error('Supabase fetch error:', lastError);
      throw new Error('Failed to connect to database. Please try again later.');
    }
  }
});

// Function to ensure user is authenticated
export async function ensureAuthenticated() {
  const { data: { session } } = await supabase.auth.getSession();
  
  // If no session exists, sign in anonymously
  if (!session) {
    console.log('No session found, signing in anonymously...');
    try {
      // For development purposes, we'll use a fixed email to avoid creating too many users
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'demo@bjjgym.app',
        password: 'demo123456'
      });
      
      if (error) {
        console.error('Error signing in:', error);
        
        // If the user doesn't exist, try to sign up
        if (error.message.includes('Invalid login credentials')) {
          console.log('User does not exist, signing up...');
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: 'demo@bjjgym.app',
            password: 'demo123456'
          });
          
          if (signUpError) {
            console.error('Error signing up:', signUpError);
            throw signUpError;
          }
          
          console.log('Signed up successfully:', signUpData);
        } else {
          throw error;
        }
      } else {
        console.log('Signed in successfully:', data);
      }
    } catch (err) {
      console.error('Authentication error:', err);
      throw new Error('Failed to authenticate with Supabase');
    }
  } else {
    console.log('User already authenticated');
  }
  
  return supabase;
}

// Function to get the current user ID
export async function getCurrentUserId(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id || null;
}