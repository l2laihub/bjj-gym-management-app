import { useState } from 'react';
import { useFinance } from '../../hooks/useFinance';
import { Transaction } from '../../types/finances';
import { Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import TransactionForm from './TransactionForm';

const TransactionHistory = () => {
  const { 
    transactions, 
    filters, 
    setFilters, 
    isLoading, 
    error, 
    removeTransaction 
  } = useFinance();
  
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  const [showEditForm, setShowEditForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Handle pagination
  const handlePrevPage = () => {
    if (filters.offset && filters.offset >= (filters.limit || 10)) {
      setFilters({
        ...filters,
        offset: filters.offset - (filters.limit || 10)
      });
    }
  };

  const handleNextPage = () => {
    setFilters({
      ...filters,
      offset: (filters.offset || 0) + (filters.limit || 10)
    });
  };

  // Handle sorting
  const handleSort = (column: 'date' | 'description' | 'amount' | 'category') => {
    const direction = 
      filters.sortBy === column && filters.sortDirection === 'asc' 
        ? 'desc' 
        : 'asc';
    
    setFilters({
      ...filters,
      sortBy: column,
      sortDirection: direction
    });
  };

  // Handle edit
  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowEditForm(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await removeTransaction(id);
      } catch {
        alert('Failed to delete transaction');
      } finally {
        setIsDeleting(null);
      }
    } else {
      setIsDeleting(null);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded mb-2"></div>
          ))}
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
        <div className="bg-red-100 p-4 rounded text-red-700">
          {error}
        </div>
      </div>
    );
  }

  // Render empty state
  if (!transactions.length) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
        <div className="text-center py-8 text-gray-500">
          <p>No transactions found.</p>
          <p className="mt-2">Add a transaction to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <h2 className="text-lg font-semibold p-6 pb-4">Transaction History</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('date')}
              >
                Date
                {filters.sortBy === 'date' && (
                  <span className="ml-1">
                    {filters.sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th 
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('description')}
              >
                Description
                {filters.sortBy === 'description' && (
                  <span className="ml-1">
                    {filters.sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th 
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('category')}
              >
                Category
                {filters.sortBy === 'category' && (
                  <span className="ml-1">
                    {filters.sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th 
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('amount')}
              >
                Amount
                {filters.sortBy === 'amount' && (
                  <span className="ml-1">
                    {filters.sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction: Transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.description}
                  {transaction.status === 'pending' && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  )}
                  {transaction.status === 'cancelled' && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      Cancelled
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.category}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  ${transaction.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(transaction)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                    aria-label={`Edit transaction: ${transaction.description}`}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="text-red-600 hover:text-red-900"
                    disabled={isDeleting === transaction.id}
                    aria-label={`Delete transaction: ${transaction.description}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={handlePrevPage}
            disabled={!filters.offset || filters.offset < (filters.limit || 10)}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              !filters.offset || filters.offset < (filters.limit || 10)
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            aria-label="Previous page"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={transactions.length < (filters.limit || 10)}
            className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              transactions.length < (filters.limit || 10)
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{(filters.offset || 0) + 1}</span> to{' '}
              <span className="font-medium">
                {(filters.offset || 0) + transactions.length}
              </span>{' '}
              results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={handlePrevPage}
                disabled={!filters.offset || filters.offset < (filters.limit || 10)}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                  !filters.offset || filters.offset < (filters.limit || 10)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNextPage}
                disabled={transactions.length < (filters.limit || 10)}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                  transactions.length < (filters.limit || 10)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
                aria-label="Next page"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Edit Form Modal */}
      {showEditForm && (
        <TransactionForm
          transaction={editingTransaction}
          onClose={() => {
            setShowEditForm(false);
            setEditingTransaction(undefined);
          }}
          onSuccess={() => {
            setShowEditForm(false);
            setEditingTransaction(undefined);
          }}
        />
      )}
    </div>
  );
};

export default TransactionHistory;