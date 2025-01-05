import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Technique, UserProgress } from '../data/mockData';
import { BeltRank } from '../utils/beltUtils';

interface CurriculumState {
  techniques: Technique[];
  userProgress: UserProgress | null;
  isLoading: boolean;
  error: string | null;
  
  // Technique actions
  fetchTechniques: () => Promise<void>;
  updateTechniqueStatus: (techniqueId: string, status: Technique['status']) => Promise<void>;
  addTechnique: (technique: Omit<Technique, 'id'>) => Promise<void>;
  
  // User progress actions
  fetchUserProgress: (userId: string) => Promise<void>;
  updateUserProgress: (progress: Partial<UserProgress>) => Promise<void>;
}

export const useCurriculumStore = create<CurriculumState>((set, get) => ({
  techniques: [],
  userProgress: null,
  isLoading: false,
  error: null,

  fetchTechniques: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('techniques')
        .select('*')
        .order('name');

      if (error) throw error;
      set({ techniques: data });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateTechniqueStatus: async (techniqueId: string, status: Technique['status']) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('techniques')
        .update({ status })
        .eq('id', techniqueId);

      if (error) throw error;

      // Update local state
      const techniques = get().techniques.map(t =>
        t.id === techniqueId ? { ...t, status } : t
      );
      set({ techniques });

      // Update user progress if needed
      const userProgress = get().userProgress;
      if (userProgress) {
        const updatedProgress = {
          ...userProgress,
          techniquesLearned: techniques.filter(t => t.status === 'mastered').length,
          techniquesInProgress: techniques.filter(t => t.status === 'learning').length,
        };
        await get().updateUserProgress(updatedProgress);
      }
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  addTechnique: async (technique: Omit<Technique, 'id'>) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('techniques')
        .insert([technique])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        techniques: [...state.techniques, data]
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUserProgress: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('userId', userId)
        .single();

      if (error) throw error;
      set({ userProgress: data });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateUserProgress: async (progress: Partial<UserProgress>) => {
    set({ isLoading: true, error: null });
    try {
      const currentProgress = get().userProgress;
      if (!currentProgress) throw new Error('No user progress found');

      const updatedProgress = { ...currentProgress, ...progress };
      const { error } = await supabase
        .from('user_progress')
        .update(updatedProgress)
        .eq('userId', currentProgress.userId);

      if (error) throw error;
      set({ userProgress: updatedProgress });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
