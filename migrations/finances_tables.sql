-- Migration script for BJJ Gym Management App Finance tables
-- This script will drop existing tables if they exist and create new ones

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS public.transactions;
DROP TABLE IF EXISTS public.transaction_categories;

-- Create transaction_categories table
CREATE TABLE public.transaction_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'both')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for transaction_categories
ALTER TABLE public.transaction_categories ENABLE ROW LEVEL SECURITY;

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled')),
  payment_method TEXT,
  reference_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create trigger function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to update the updated_at column
CREATE TRIGGER update_transaction_categories_updated_at
BEFORE UPDATE ON public.transaction_categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert default transaction categories
INSERT INTO public.transaction_categories (name, type, description)
VALUES 
  ('Membership Fees', 'income', 'Monthly and annual membership fees'),
  ('Private Lessons', 'income', 'One-on-one training sessions'),
  ('Merchandise Sales', 'income', 'Sales of gym merchandise and equipment'),
  ('Seminars', 'income', 'Special training seminars and workshops'),
  ('Competitions', 'income', 'Entry fees for competitions'),
  ('Other Income', 'income', 'Miscellaneous income sources'),
  
  ('Rent', 'expense', 'Monthly rent for facility'),
  ('Utilities', 'expense', 'Electricity, water, internet, etc.'),
  ('Equipment', 'expense', 'Purchase of gym equipment'),
  ('Maintenance', 'expense', 'Facility maintenance and repairs'),
  ('Insurance', 'expense', 'Business and liability insurance'),
  ('Marketing', 'expense', 'Advertising and promotional expenses'),
  ('Staff Salaries', 'expense', 'Payments to instructors and staff'),
  ('Supplies', 'expense', 'Office and cleaning supplies'),
  ('Other Expenses', 'expense', 'Miscellaneous expenses');

-- Insert sample transactions (optional, comment out if not needed)
INSERT INTO public.transactions (description, amount, type, category, date, status)
VALUES 
  ('Monthly Membership - John Smith', 150.00, 'income', 'Membership Fees', CURRENT_DATE - INTERVAL '5 days', 'completed'),
  ('Private Lesson - Sarah Johnson', 75.00, 'income', 'Private Lessons', CURRENT_DATE - INTERVAL '3 days', 'completed'),
  ('New Mats Purchase', 1200.00, 'expense', 'Equipment', CURRENT_DATE - INTERVAL '10 days', 'completed'),
  ('March Rent Payment', 2500.00, 'expense', 'Rent', CURRENT_DATE - INTERVAL '15 days', 'completed'),
  ('Merchandise Sale - T-shirts', 350.00, 'income', 'Merchandise Sales', CURRENT_DATE - INTERVAL '2 days', 'completed'),
  ('Electricity Bill', 180.00, 'expense', 'Utilities', CURRENT_DATE - INTERVAL '7 days', 'completed'),
  ('Competition Entry Fees', 500.00, 'income', 'Competitions', CURRENT_DATE - INTERVAL '1 day', 'pending'),
  ('Marketing - Social Media Ads', 120.00, 'expense', 'Marketing', CURRENT_DATE - INTERVAL '8 days', 'completed');

-- Grant necessary permissions (adjust as needed for your Supabase setup)
GRANT ALL ON public.transaction_categories TO authenticated;
GRANT ALL ON public.transactions TO authenticated;
