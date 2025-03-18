// Script to insert test financial data into Supabase
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test data
const testTransactions = [
  {
    description: 'Monthly Membership Fee - John Doe',
    amount: 120,
    type: 'income',
    category: 'Membership',
    date: '2025-03-15',
    status: 'completed',
    payment_method: 'credit_card'
  },
  {
    description: 'Private Lesson - Sarah Johnson',
    amount: 85,
    type: 'income',
    category: 'Private Lessons',
    date: '2025-03-16',
    status: 'completed',
    payment_method: 'cash'
  },
  {
    description: 'Equipment Purchase - New Mats',
    amount: 750,
    type: 'expense',
    category: 'Equipment',
    date: '2025-03-10',
    status: 'completed',
    payment_method: 'bank_transfer'
  },
  {
    description: 'Rent Payment',
    amount: 1200,
    type: 'expense',
    category: 'Rent',
    date: '2025-03-01',
    status: 'completed',
    payment_method: 'bank_transfer'
  },
  {
    description: 'Utilities - Electricity',
    amount: 180,
    type: 'expense',
    category: 'Utilities',
    date: '2025-03-05',
    status: 'completed',
    payment_method: 'bank_transfer'
  },
  {
    description: 'Tournament Registration Fees',
    amount: 350,
    type: 'income',
    category: 'Events',
    date: '2025-03-12',
    status: 'pending',
    payment_method: 'credit_card'
  }
];

const testCategories = [
  { name: 'Membership', type: 'income', color: '#4CAF50' },
  { name: 'Private Lessons', type: 'income', color: '#2196F3' },
  { name: 'Events', type: 'income', color: '#9C27B0' },
  { name: 'Merchandise', type: 'income', color: '#FF9800' },
  { name: 'Rent', type: 'expense', color: '#F44336' },
  { name: 'Utilities', type: 'expense', color: '#FF5722' },
  { name: 'Equipment', type: 'expense', color: '#795548' },
  { name: 'Marketing', type: 'expense', color: '#607D8B' },
  { name: 'Insurance', type: 'expense', color: '#9E9E9E' },
  { name: 'Staff', type: 'expense', color: '#E91E63' }
];

// Insert test data
async function insertTestData() {
  try {
    console.log('Checking existing data...');
    
    // Check if we already have transactions
    const { data: existingTransactions, error: transError } = await supabase
      .from('transactions')
      .select('count');
      
    if (transError) {
      console.error('Error checking transactions:', transError);
      return;
    }
    
    const transactionCount = existingTransactions[0]?.count || 0;
    console.log(`Found ${transactionCount} existing transactions`);
    
    // Only insert if we don't have any transactions
    if (transactionCount === 0) {
      console.log('Inserting test transactions...');
      const { data: transData, error: transInsertError } = await supabase
        .from('transactions')
        .insert(testTransactions);
        
      if (transInsertError) {
        console.error('Error inserting transactions:', transInsertError);
      } else {
        console.log('Successfully inserted test transactions');
      }
    } else {
      console.log('Transactions already exist, skipping insertion');
    }
    
    // Check if we already have categories
    const { data: existingCategories, error: catError } = await supabase
      .from('transaction_categories')
      .select('count');
      
    if (catError) {
      console.error('Error checking categories:', catError);
      return;
    }
    
    const categoryCount = existingCategories[0]?.count || 0;
    console.log(`Found ${categoryCount} existing categories`);
    
    // Only insert if we don't have any categories
    if (categoryCount === 0) {
      console.log('Inserting test categories...');
      const { data: catData, error: catInsertError } = await supabase
        .from('transaction_categories')
        .insert(testCategories);
        
      if (catInsertError) {
        console.error('Error inserting categories:', catInsertError);
      } else {
        console.log('Successfully inserted test categories');
      }
    } else {
      console.log('Categories already exist, skipping insertion');
    }
    
    console.log('Test data insertion complete');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
insertTestData();
