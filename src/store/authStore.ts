import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: any | null
  isAdmin: boolean
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, role?: string) => Promise<void>
  signOut: () => Promise<void>
  checkUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isAdmin: false,
  loading: true,

  signIn: async (email: string, password: string) => {
    try {
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error

      set({
        user: session?.user ?? null,
        session,
        isAdmin: session?.user?.user_metadata?.role === 'admin',
      })
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    }
  },

  signUp: async (email: string, password: string, role: string = 'student') => {
    try {
      const { data: { session }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
          },
        },
      })
      if (error) throw error

      // Create initial user progress
      if (session?.user) {
        const { error: progressError } = await supabase
          .from('user_progress')
          .insert([
            {
              user_id: session.user.id,
              belt_rank: 'white',
              stripes: 0,
            },
          ])
        if (progressError) throw progressError
      }

      set({
        user: session?.user ?? null,
        session,
        isAdmin: role === 'admin',
      })
    } catch (error) {
      console.error('Error signing up:', error)
      throw error
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      set({ user: null, session: null, isAdmin: false })
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  },

  checkUser: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error

      set({
        user: session?.user ?? null,
        session,
        isAdmin: session?.user?.user_metadata?.role === 'admin',
        loading: false,
      })
    } catch (error) {
      console.error('Error checking user:', error)
      set({ loading: false })
    }
  },
}))
