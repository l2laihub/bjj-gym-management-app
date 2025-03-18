-- First, drop any existing policies
DROP POLICY IF EXISTS "Allow authenticated users full access to transaction_categories" ON public.transaction_categories;
DROP POLICY IF EXISTS "Allow authenticated users full access to transactions" ON public.transactions;

-- Create policy for transaction_categories to allow authenticated users to perform all operations
CREATE POLICY "Enable all operations for authenticated users only"
ON public.transaction_categories
FOR ALL
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Create policy for transactions to allow authenticated users to perform all operations
CREATE POLICY "Enable all operations for authenticated users only"
ON public.transactions
FOR ALL
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Make sure permissions are properly set
GRANT ALL ON public.transaction_categories TO authenticated;
GRANT ALL ON public.transactions TO authenticated;
