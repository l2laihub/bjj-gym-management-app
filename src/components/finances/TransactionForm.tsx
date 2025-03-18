import React, { useState, useEffect, useMemo } from 'react';
import { useFinance } from '../../hooks/useFinance';
import { Transaction, TransactionCategory } from '../../types/finances';
import { X } from 'lucide-react';

interface TransactionFormProps {
  transaction?: Transaction;
  onClose: () => void;
  onSuccess?: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  transaction,
  onClose,
  onSuccess
}) => {
  const { categories, addTransaction, editTransaction } = useFinance();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'income',
    category: '',
    date: new Date().toISOString().split('T')[0],
    status: 'completed',
    payment_method: '',
    reference_number: '',
    notes: ''
  });

  // Initialize form with transaction data if editing
  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description,
        amount: transaction.amount.toString(),
        type: transaction.type,
        category: transaction.category,
        date: transaction.date,
        status: transaction.status,
        payment_method: transaction.payment_method || '',
        reference_number: transaction.reference_number || '',
        notes: transaction.notes || ''
      });
    }
  }, [transaction]);

  // Filter categories based on transaction type
  const filteredCategories = useMemo(() => {
    return categories.filter((category: TransactionCategory) => {
      if (!formData.type) return true;
      return category.type === formData.type || category.type === 'both';
    });
  }, [categories, formData.type]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // If changing type, reset category
    if (name === 'type') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        category: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate form
      if (!formData.description.trim()) {
        throw new Error('Description is required');
      }

      if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
        throw new Error('Please enter a valid amount');
      }

      if (!formData.category) {
        throw new Error('Please select a category');
      }

      console.log('Submitting transaction form with data:', formData);

      const transactionData = {
        description: formData.description.trim(),
        amount: Number(formData.amount),
        type: formData.type as 'income' | 'expense',
        category: formData.category,
        date: formData.date,
        status: formData.status as 'pending' | 'completed' | 'cancelled',
        payment_method: formData.payment_method.trim() || undefined,
        reference_number: formData.reference_number.trim() || undefined,
        notes: formData.notes.trim() || undefined
      };

      if (transaction) {
        // Update existing transaction
        console.log('Updating transaction:', transaction.id);
        await editTransaction(transaction.id, transactionData);
        console.log('Transaction updated successfully');
      } else {
        // Create new transaction
        console.log('Creating new transaction');
        await addTransaction(transactionData);
        console.log('Transaction created successfully');
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Error in transaction form submission:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {transaction ? 'Edit Transaction' : 'Add Transaction'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Transaction Type */}
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-gray-700">Type</span>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-gray-700">Status</span>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  >
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </label>
              </div>

              {/* Description */}
              <div>
                <label className="block">
                  <span className="text-gray-700">Description</span>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="e.g., Monthly Membership - John Silva"
                    required
                  />
                </label>
              </div>

              {/* Amount and Date */}
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-gray-700">Amount ($)</span>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-gray-700">Date</span>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </label>
              </div>

              {/* Category */}
              <div>
                <label className="block">
                  <span className="text-gray-700">Category</span>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select a category</option>
                    {filteredCategories.map((category: TransactionCategory) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block">
                  <span className="text-gray-700">Payment Method (Optional)</span>
                  <input
                    type="text"
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="e.g., Credit Card, Cash, Bank Transfer"
                  />
                </label>
              </div>

              {/* Reference Number */}
              <div>
                <label className="block">
                  <span className="text-gray-700">Reference Number (Optional)</span>
                  <input
                    type="text"
                    name="reference_number"
                    value={formData.reference_number}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="e.g., Invoice #, Receipt #"
                  />
                </label>
              </div>

              {/* Notes */}
              <div>
                <label className="block">
                  <span className="text-gray-700">Notes (Optional)</span>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Additional details about this transaction"
                  />
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : transaction ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;
