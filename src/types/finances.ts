import { Database } from '../lib/database.types';

// Transaction Types
export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
export type TransactionUpdate = Database['public']['Tables']['transactions']['Update'];

// Category Types
export type TransactionCategory = Database['public']['Tables']['transaction_categories']['Row'];
export type TransactionCategoryInsert = Database['public']['Tables']['transaction_categories']['Insert'];
export type TransactionCategoryUpdate = Database['public']['Tables']['transaction_categories']['Update'];

// Filter Types
export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  type?: 'income' | 'expense';
  category?: string;
  status?: 'pending' | 'completed' | 'cancelled';
  search?: string;
  sortBy?: 'date' | 'amount' | 'description' | 'category';
  sortDirection?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

// Stats Types
export interface FinancialStats {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  pendingIncome: number;
  pendingExpenses: number;
  recentTransactions: Transaction[];
  topCategories: {
    name: string;
    amount: number;
    percentage: number;
  }[];
}

// Chart Data Types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
  }[];
}

// Time Period Type
export type TimePeriod = 'day' | 'week' | 'month' | 'quarter' | 'year';
