import { supabase, ensureAuthenticated } from '../supabase';
import { supabaseAdmin, bypassRLS } from '../supabase-admin';
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
} from '../../types/finances';

// Debug function to check Supabase connection and permissions
export async function checkSupabaseConnection() {
  console.log('Checking Supabase connection and permissions...');
  
  try {
    // Check auth status
    const { data: authData } = await supabase.auth.getSession();
    console.log('Auth session:', authData?.session ? 'Active' : 'Not active');
    
    // Try to access the transactions table directly
    const { data: transData, error: transError } = await supabase
      .from('transactions')
      .select('*');
      
    if (transError) {
      console.error('Error accessing transactions table:', transError);
    } else {
      console.log('Transactions table accessible, count:', transData?.length || 0);
      console.log('Sample transaction:', transData?.[0]);
    }
    
    // Try to access the transaction_categories table
    const { data: catData, error: catError } = await supabase
      .from('transaction_categories')
      .select('*');
      
    if (catError) {
      console.error('Error accessing transaction_categories table:', catError);
    } else {
      console.log('Transaction_categories table accessible, count:', catData?.length || 0);
      console.log('Sample category:', catData?.[0]);
    }
    
    return {
      authStatus: authData?.session ? 'Active' : 'Not active',
      transactionsAccessible: !transError,
      categoriesAccessible: !catError,
      transactionsCount: transData?.length || 0,
      categoriesCount: catData?.length || 0
    };
  } catch (error) {
    console.error('Error checking Supabase connection:', error);
    return {
      authStatus: 'Error',
      transactionsAccessible: false,
      categoriesAccessible: false,
      error
    };
  }
}

/**
 * Fetch transactions with optional filters
 */
export async function getTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
  console.log('Fetching transactions with filters:', filters);
  
  try {
    // Ensure user is authenticated before making the request
    await ensureAuthenticated();
    
    // Choose the client based on environment
    const client = bypassRLS ? supabaseAdmin : supabase;
    
    // Build the query
    let query = client
      .from('transactions')
      .select('*');

    // Apply filters if provided
    if (filters) {
      if (filters.startDate) {
        query = query.gte('date', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('date', filters.endDate);
      }
      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.search) {
        query = query.ilike('description', `%${filters.search}%`);
      }

      // Apply sorting
      if (filters.sortBy) {
        const direction = filters.sortDirection || 'desc';
        query = query.order(filters.sortBy, { ascending: direction === 'asc' });
      } else {
        // Default sort by date descending
        query = query.order('date', { ascending: false });
      }

      // Apply pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }
    } else {
      // Default sort by date descending
      query = query.order('date', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching transactions:', error);
      throw new Error(`Failed to fetch transactions: ${error.message}`);
    }

    console.log('Fetched transactions:', data?.length || 0);
    if (data && data.length > 0) {
      console.log('Sample transaction:', data[0]);
    }
    
    return data || [];
  } catch (err) {
    console.error('Unexpected error in getTransactions:', err);
    throw err;
  }
}

/**
 * Fetch a single transaction by ID
 */
export async function getTransactionById(id: string): Promise<Transaction | null> {
  try {
    // Ensure user is authenticated before making the request
    await ensureAuthenticated();
    
    // Choose the client based on environment
    const client = bypassRLS ? supabaseAdmin : supabase;
    
    const { data, error } = await client
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // PGRST116 is the error code for "no rows returned"
        return null;
      }
      console.error('Error fetching transaction:', error);
      throw new Error(`Failed to fetch transaction: ${error.message}`);
    }

    return data;
  } catch (err) {
    console.error('Unexpected error in getTransactionById:', err);
    throw err;
  }
}

/**
 * Create a new transaction
 */
export async function createTransaction(data: TransactionInsert): Promise<Transaction> {
  console.log('API: Creating transaction with data:', data);
  
  try {
    // Ensure user is authenticated before making the request
    await ensureAuthenticated();
    
    // Choose the client based on environment
    const client = bypassRLS ? supabaseAdmin : supabase;
    
    const { data: transaction, error } = await client
      .from('transactions')
      .insert(data)
      .select('*')
      .single();

    if (error) {
      console.error('API: Error creating transaction:', error);
      throw new Error(`Failed to create transaction: ${error.message}`);
    }

    if (!transaction) {
      console.error('API: No transaction returned after creation');
      throw new Error('Failed to create transaction: No data returned');
    }

    console.log('API: Transaction created successfully:', transaction);
    return transaction;
  } catch (err) {
    console.error('API: Unexpected error in createTransaction:', err);
    throw err;
  }
}

/**
 * Update an existing transaction
 */
export async function updateTransaction(id: string, data: TransactionUpdate): Promise<Transaction> {
  try {
    // Ensure user is authenticated before making the request
    await ensureAuthenticated();
    
    // Choose the client based on environment
    const client = bypassRLS ? supabaseAdmin : supabase;
    
    const { data: transaction, error } = await client
      .from('transactions')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating transaction:', error);
      throw new Error(`Failed to update transaction: ${error.message}`);
    }

    return transaction;
  } catch (err) {
    console.error('Unexpected error in updateTransaction:', err);
    throw err;
  }
}

/**
 * Delete a transaction
 */
export async function deleteTransaction(id: string): Promise<void> {
  try {
    // Ensure user is authenticated before making the request
    await ensureAuthenticated();
    
    // Choose the client based on environment
    const client = bypassRLS ? supabaseAdmin : supabase;
    
    const { error } = await client
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting transaction:', error);
      throw new Error(`Failed to delete transaction: ${error.message}`);
    }
  } catch (err) {
    console.error('Unexpected error in deleteTransaction:', err);
    throw err;
  }
}

/**
 * Fetch transaction categories with optional type filter
 */
export async function getCategories(type?: 'income' | 'expense' | 'both'): Promise<TransactionCategory[]> {
  try {
    // Ensure user is authenticated before making the request
    await ensureAuthenticated();
    
    // Choose the client based on environment
    const client = bypassRLS ? supabaseAdmin : supabase;
    
    let query = client
      .from('transaction_categories')
      .select('*')
      .order('name');

    if (type) {
      // If type is specified, get categories of that type or 'both'
      query = query.or(`type.eq.${type},type.eq.both`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching categories:', error);
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    return data || [];
  } catch (err) {
    console.error('Unexpected error in getCategories:', err);
    throw err;
  }
}

/**
 * Create a new transaction category
 */
export async function createCategory(data: TransactionCategoryInsert): Promise<TransactionCategory> {
  try {
    // Ensure user is authenticated before making the request
    await ensureAuthenticated();
    
    // Choose the client based on environment
    const client = bypassRLS ? supabaseAdmin : supabase;
    
    const { data: category, error } = await client
      .from('transaction_categories')
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      throw new Error(`Failed to create category: ${error.message}`);
    }

    return category;
  } catch (err) {
    console.error('Unexpected error in createCategory:', err);
    throw err;
  }
}

/**
 * Update an existing transaction category
 */
export async function updateCategory(id: string, data: TransactionCategoryUpdate): Promise<TransactionCategory> {
  try {
    // Ensure user is authenticated before making the request
    await ensureAuthenticated();
    
    // Choose the client based on environment
    const client = bypassRLS ? supabaseAdmin : supabase;
    
    const { data: category, error } = await client
      .from('transaction_categories')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating category:', error);
      throw new Error(`Failed to update category: ${error.message}`);
    }

    return category;
  } catch (err) {
    console.error('Unexpected error in updateCategory:', err);
    throw err;
  }
}

/**
 * Delete a transaction category
 */
export async function deleteCategory(id: string): Promise<void> {
  try {
    // Ensure user is authenticated before making the request
    await ensureAuthenticated();
    
    // Choose the client based on environment
    const client = bypassRLS ? supabaseAdmin : supabase;
    
    const { error } = await client
      .from('transaction_categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      throw new Error(`Failed to delete category: ${error.message}`);
    }
  } catch (err) {
    console.error('Unexpected error in deleteCategory:', err);
    throw err;
  }
}

/**
 * Get financial statistics for a specific time period
 */
export async function getFinancialStats(period: TimePeriod = 'month'): Promise<FinancialStats> {
  try {
    // Ensure user is authenticated before making the request
    await ensureAuthenticated();
    
    // Choose the client based on environment
    const client = bypassRLS ? supabaseAdmin : supabase;
    
    // Calculate date range based on period
    const now = new Date();
    const startDate = new Date();
    
    switch (period) {
      case 'day':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    // Format dates for Supabase query
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = now.toISOString().split('T')[0];

    console.log('Current date:', now.toISOString());
    console.log('Fetching transactions for stats:', { formattedStartDate, formattedEndDate });

    // Fetch transactions for the period
    const { data: transactions, error } = await client
      .from('transactions')
      .select('*')
      .gte('date', formattedStartDate)
      .lte('date', formattedEndDate);

    if (error) {
      console.error('Error fetching transactions for stats:', error);
      throw new Error(`Failed to fetch transactions for stats: ${error.message}`);
    }

    console.log('All transactions fetched:', transactions?.length || 0);
    if (transactions && transactions.length > 0) {
      console.log('Sample transaction:', transactions[0]);
    }

    // Calculate statistics
    let totalIncome = 0;
    let totalExpenses = 0;
    let pendingIncome = 0;
    let pendingExpenses = 0;
    const categoryAmounts: Record<string, number> = {};

    transactions?.forEach(transaction => {
      // Parse amount as number to ensure correct calculations
      const amount = Number(transaction.amount);
      
      if (transaction.type === 'income') {
        if (transaction.status === 'completed') {
          totalIncome += amount;
        } else if (transaction.status === 'pending') {
          pendingIncome += amount;
        }
      } else if (transaction.type === 'expense') {
        if (transaction.status === 'completed') {
          totalExpenses += amount;
        } else if (transaction.status === 'pending') {
          pendingExpenses += amount;
        }
      }

      // Track category amounts for expense breakdown
      if (transaction.type === 'expense' && transaction.status === 'completed') {
        if (!categoryAmounts[transaction.category]) {
          categoryAmounts[transaction.category] = 0;
        }
        categoryAmounts[transaction.category] += amount;
      }
    });

    // Calculate net income
    const netIncome = totalIncome - totalExpenses;

    // Get top categories
    const topCategories = Object.entries(categoryAmounts)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // Get recent transactions
    const recentTransactions = transactions ? [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5) : [];

    const stats = {
      totalIncome,
      totalExpenses,
      netIncome,
      pendingIncome,
      pendingExpenses,
      recentTransactions,
      topCategories
    };

    console.log('Calculated stats:', stats);
    return stats;
  } catch (error) {
    console.error('Error in getFinancialStats:', error);
    throw error;
  }
}

/**
 * Get chart data for revenue over time
 */
export async function getRevenueChartData(period: TimePeriod = 'month'): Promise<{
  labels: string[];
  incomeData: number[];
  expenseData: number[];
}> {
  try {
    // Ensure user is authenticated before making the request
    await ensureAuthenticated();
    
    // Choose the client based on environment
    const client = bypassRLS ? supabaseAdmin : supabase;
    
    // Calculate date range based on period
    const now = new Date();
    const startDate = new Date();
    let intervalFormat: 'day' | 'week' | 'month' = 'day';
    
    switch (period) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        intervalFormat = 'day';
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        intervalFormat = 'day';
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        intervalFormat = 'day';
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        intervalFormat = 'week';
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        intervalFormat = 'month';
        break;
    }

    // Format dates for Supabase query
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = now.toISOString().split('T')[0];

    // Fetch transactions for the period
    const { data: transactions, error } = await client
      .from('transactions')
      .select('*')
      .gte('date', formattedStartDate)
      .lte('date', formattedEndDate)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching transactions for chart:', error);
      throw new Error(`Failed to fetch transactions for chart: ${error.message}`);
    }

    // Generate time intervals based on period
    const intervals: Date[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= now) {
      intervals.push(new Date(currentDate));
      
      switch (intervalFormat) {
        case 'day':
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case 'week':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case 'month':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
      }
    }

    // Format labels based on interval
    const labels = intervals.map(date => {
      switch (intervalFormat) {
        case 'day':
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        case 'week':
          return `Week of ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
        case 'month':
          return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        default:
          return date.toLocaleDateString();
      }
    });

    // Initialize data arrays with zeros
    const incomeData = new Array(intervals.length).fill(0);
    const expenseData = new Array(intervals.length).fill(0);

    // Aggregate transaction data by interval
    transactions?.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      let intervalIndex = -1;
      
      for (let i = 0; i < intervals.length - 1; i++) {
        if (transactionDate >= intervals[i] && transactionDate < intervals[i + 1]) {
          intervalIndex = i;
          break;
        }
      }
      
      // If it's after the last interval start, it belongs to the last interval
      if (intervalIndex === -1 && transactionDate >= intervals[intervals.length - 1]) {
        intervalIndex = intervals.length - 1;
      }
      
      if (intervalIndex !== -1 && transaction.status === 'completed') {
        if (transaction.type === 'income') {
          incomeData[intervalIndex] += Number(transaction.amount);
        } else {
          expenseData[intervalIndex] += Number(transaction.amount);
        }
      }
    });

    return {
      labels,
      incomeData,
      expenseData
    };
  } catch (err) {
    console.error('Unexpected error in getRevenueChartData:', err);
    throw err;
  }
}
