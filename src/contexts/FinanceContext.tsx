import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  Transaction,
  TransactionInsert,
  TransactionUpdate,
  TransactionCategory,
  TransactionCategoryInsert,
  TransactionCategoryUpdate,
  TransactionFilters,
  FinancialStats,
  TimePeriod
} from '../types/finances';
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getFinancialStats,
  getRevenueChartData,
  checkSupabaseConnection
} from '../lib/finances/api';
import { ensureAuthenticated } from '../lib/supabase';

// Define chart data type to match existing implementation
interface ChartData {
  labels: string[];
  incomeData: number[];
  expenseData: number[];
}

// Define the context type
interface FinanceContextType {
  transactions: Transaction[];
  categories: TransactionCategory[];
  stats: FinancialStats | null;
  chartData: {
    labels: string[];
    incomeData: number[];
    expenseData: number[];
  } | null;
  filters: TransactionFilters;
  period: TimePeriod;
  isLoading: boolean;
  isLoadingTransactions: boolean;
  isLoadingCategories: boolean;
  isLoadingStats: boolean;
  isLoadingChartData: boolean;
  loading: boolean; // Keep for backward compatibility
  error: string | null;
  setFilters: (filters: TransactionFilters) => void;
  setPeriod: (period: TimePeriod) => void;
  refreshTransactions: () => Promise<Transaction[]>;
  refreshCategories: () => Promise<TransactionCategory[]>;
  refreshStats: (period?: TimePeriod) => Promise<FinancialStats | null>;
  refreshChartData: (period?: TimePeriod) => Promise<{
    labels: string[];
    incomeData: number[];
    expenseData: number[];
  } | null>;
  getTransaction: (id: string) => Promise<Transaction | null>;
  addTransaction: (data: TransactionInsert) => Promise<Transaction>;
  editTransaction: (id: string, data: TransactionUpdate) => Promise<Transaction>;
  removeTransaction: (id: string) => Promise<void>;
  addCategory: (data: TransactionCategoryInsert) => Promise<TransactionCategory>;
  editCategory: (id: string, data: TransactionCategoryUpdate) => Promise<TransactionCategory>;
  removeCategory: (id: string) => Promise<void>;
}

// Create the context with a default value
export const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// Provider component
interface FinanceProviderProps {
  children: ReactNode;
}

export const FinanceProvider: React.FC<FinanceProviderProps> = ({ children }) => {
  // State for transactions
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for filters
  const [filters, setFilters] = useState<TransactionFilters>({
    sortBy: 'date',
    sortDirection: 'desc',
    limit: 10,
    offset: 0
  });
  
  // State for financial stats
  const [stats, setStats] = useState<FinancialStats | null>(null);
  
  // State for chart data
  const [chartData, setChartData] = useState<ChartData | null>(null);

  // Ensure authentication is set up
  useEffect(() => {
    const initAuth = async () => {
      try {
        await ensureAuthenticated();
        console.log('Authentication initialized');
      } catch (err) {
        console.error('Failed to initialize authentication:', err);
        setError('Failed to connect to the database. Please try again later.');
      }
    };
    
    initAuth();
  }, []);

  // Fetch transactions based on current filters
  const refreshTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Refreshing transactions...');
      const data = await getTransactions(filters);
      console.log(`Retrieved ${data.length} transactions`);
      setTransactions(data);
      return data;
    } catch (error) {
      console.error('Error refreshing transactions:', error);
      setError(error instanceof Error ? error.message : 'Failed to load transactions');
      return [];
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch categories
  const refreshCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getCategories();
      setCategories(data);
      return data;
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch categories');
      // Provide mock categories when the database table doesn't exist
      setCategories([
        {
          id: '1',
          name: 'Membership',
          type: 'income',
          description: 'Monthly and annual membership fees',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Equipment',
          type: 'expense',
          description: 'Gym equipment purchases',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Private Lessons',
          type: 'income',
          description: 'One-on-one training sessions',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '4',
          name: 'Rent',
          type: 'expense',
          description: 'Monthly rent for facility',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '5',
          name: 'Utilities',
          type: 'expense',
          description: 'Electricity, water, internet',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch financial stats
  const refreshStats = useCallback(async (period: TimePeriod = 'month') => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Refreshing financial stats...');
      const data = await getFinancialStats(period);
      console.log('Retrieved financial stats:', data);
      setStats(data);
      return data;
    } catch (error) {
      console.error('Error refreshing stats:', error);
      setError(error instanceof Error ? error.message : 'Failed to load financial stats');
      // Provide mock stats when the database table doesn't exist
      setStats({
        totalIncome: 24500,
        totalExpenses: 8900,
        netIncome: 15600,
        pendingIncome: 1200,
        pendingExpenses: 1100,
        recentTransactions: [
          {
            id: '1',
            description: 'Monthly Membership',
            amount: 150,
            type: 'income',
            category: 'Membership',
            date: new Date().toISOString().split('T')[0],
            status: 'completed',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            description: 'Equipment Purchase',
            amount: 500,
            type: 'expense',
            category: 'Equipment',
            date: new Date().toISOString().split('T')[0],
            status: 'completed',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ],
        topCategories: [
          { name: 'Membership', amount: 18000, percentage: 73.5 },
          { name: 'Private Lessons', amount: 4500, percentage: 18.4 },
          { name: 'Merchandise', amount: 2000, percentage: 8.1 }
        ]
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch chart data
  const refreshChartData = useCallback(async (period: TimePeriod = 'month') => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getRevenueChartData(period);
      setChartData(data);
      return data;
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setError('Failed to fetch chart data');
      // Provide mock chart data when the database table doesn't exist
      setChartData({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        incomeData: [18500, 19800, 21200, 22100, 23400, 24500],
        expenseData: [7200, 7800, 8100, 8400, 8700, 8900]
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get a single transaction by ID
  const getTransaction = async (id: string) => {
    try {
      return await getTransactionById(id);
    } catch (err) {
      console.error('Error fetching transaction:', err);
      throw err;
    }
  };

  // Add a new transaction
  const addTransaction = async (data: TransactionInsert) => {
    try {
      const newTransaction = await createTransaction(data);
      
      // Refresh data after adding
      refreshTransactions();
      refreshStats();
      refreshChartData();
      
      return newTransaction;
    } catch (err) {
      console.error('Error adding transaction:', err);
      throw err;
    }
  };

  // Edit an existing transaction
  const editTransaction = async (id: string, data: TransactionUpdate) => {
    try {
      const updatedTransaction = await updateTransaction(id, data);
      
      // Refresh data after editing
      refreshTransactions();
      refreshStats();
      refreshChartData();
      
      return updatedTransaction;
    } catch (err) {
      console.error('Error updating transaction:', err);
      throw err;
    }
  };

  // Delete a transaction
  const removeTransaction = useCallback(async (id: string): Promise<void> => {
    console.log('Deleting transaction with ID:', id);
    setLoading(true);
    try {
      await deleteTransaction(id);
      console.log('Transaction deleted successfully');
      // Refresh transactions after deletion
      await refreshTransactions();
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError('Failed to delete transaction');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshTransactions]);

  // Add a new category
  const addCategory = async (data: TransactionCategoryInsert) => {
    try {
      const newCategory = await createCategory(data);
      
      // Refresh categories after adding
      refreshCategories();
      
      return newCategory;
    } catch (err) {
      console.error('Error adding category:', err);
      throw err;
    }
  };

  // Edit an existing category
  const editCategory = async (id: string, data: TransactionCategoryUpdate) => {
    try {
      const updatedCategory = await updateCategory(id, data);
      
      // Refresh categories after editing
      refreshCategories();
      
      return updatedCategory;
    } catch (err) {
      console.error('Error updating category:', err);
      throw err;
    }
  };

  // Remove a category
  const removeCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      
      // Refresh categories after removing
      refreshCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
      throw err;
    }
  };

  // Check Supabase connection and create test data if needed
  const checkConnection = useCallback(async () => {
    try {
      const status = await checkSupabaseConnection();
      console.log('Supabase connection status:', status);
      
      // If no transactions exist, create a test transaction
      if (status.transactionsCount === 0) {
        console.log('No transactions found in database. Creating a test transaction...');
        try {
          // Create a test transaction
          const testTransaction: TransactionInsert = {
            description: 'Test Income',
            amount: 100,
            type: 'income',
            category: 'Membership',
            date: new Date().toISOString().split('T')[0],
            status: 'completed',
            payment_method: 'Cash',
            reference_number: 'TEST-001',
            notes: 'This is a test transaction created automatically'
          };
          
          await createTransaction(testTransaction);
          console.log('Test transaction created successfully');
          
          // Refresh data
          refreshTransactions();
          refreshStats();
          refreshChartData();
        } catch (err) {
          console.error('Failed to create test transaction:', err);
        }
      }
    } catch (err) {
      console.error('Error checking Supabase connection:', err);
      setError('Failed to connect to the database. Please try again later.');
    }
  }, [refreshTransactions, refreshStats, refreshChartData]);

  // Initial data loading
  useEffect(() => {
    refreshTransactions();
    refreshCategories();
    refreshStats();
    refreshChartData();
    checkConnection(); // Check connection and create test data if needed
  }, [refreshTransactions, refreshCategories, refreshStats, refreshChartData, checkConnection]);

  // Refresh transactions when filters change - this is now handled by the refreshTransactions useCallback dependency

  // Refresh stats and chart data periodically (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      refreshStats();
      refreshChartData();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [refreshStats, refreshChartData]);

  // Context value
  const value: FinanceContextType = {
    transactions,
    categories,
    stats,
    chartData,
    filters,
    period: 'month',
    isLoading: loading,
    isLoadingTransactions: loading,
    isLoadingCategories: loading,
    isLoadingStats: loading,
    isLoadingChartData: loading,
    loading, // Keep for backward compatibility
    error,
    setFilters,
    setPeriod: () => {}, // Placeholder implementation
    refreshTransactions,
    refreshCategories,
    refreshStats,
    refreshChartData,
    getTransaction,
    addTransaction,
    editTransaction,
    removeTransaction,
    addCategory,
    editCategory,
    removeCategory
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};
