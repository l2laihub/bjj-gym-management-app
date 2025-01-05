export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      techniques: {
        Row: {
          id: string
          name: string
          description: string
          category: 'Guard' | 'Mount' | 'Side Control' | 'Back Control' | 'Takedowns' | 'Submissions'
          beltLevel: 'white' | 'blue' | 'purple' | 'brown' | 'black'
          videoUrl?: string
          status: 'not_started' | 'learning' | 'mastered'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          category: 'Guard' | 'Mount' | 'Side Control' | 'Back Control' | 'Takedowns' | 'Submissions'
          beltLevel: 'white' | 'blue' | 'purple' | 'brown' | 'black'
          videoUrl?: string
          status?: 'not_started' | 'learning' | 'mastered'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category?: 'Guard' | 'Mount' | 'Side Control' | 'Back Control' | 'Takedowns' | 'Submissions'
          beltLevel?: 'white' | 'blue' | 'purple' | 'brown' | 'black'
          videoUrl?: string
          status?: 'not_started' | 'learning' | 'mastered'
          created_at?: string
          updated_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          userId: string
          beltRank: 'white' | 'blue' | 'purple' | 'brown' | 'black'
          stripes: number
          monthsAtCurrentBelt: number
          classesAttended: number
          techniquesLearned: number
          techniquesInProgress: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          userId: string
          beltRank: 'white' | 'blue' | 'purple' | 'brown' | 'black'
          stripes?: number
          monthsAtCurrentBelt?: number
          classesAttended?: number
          techniquesLearned?: number
          techniquesInProgress?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          userId?: string
          beltRank?: 'white' | 'blue' | 'purple' | 'brown' | 'black'
          stripes?: number
          monthsAtCurrentBelt?: number
          classesAttended?: number
          techniquesLearned?: number
          techniquesInProgress?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
