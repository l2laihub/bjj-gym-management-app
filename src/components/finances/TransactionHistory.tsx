import React from 'react';
import { ArrowUpRight, ArrowDownRight, MoreVertical } from 'lucide-react';

const transactions = [
  {
    id: 1,
    description: 'Monthly Membership - John Silva',
    amount: 150,
    type: 'income',
    category: 'Membership',
    date: '2024-03-12',
    status: 'completed',
  },
  {
    id: 2,
    description: 'Equipment Purchase - Training Mats',
    amount: 800,
    type: 'expense',
    category: 'Equipment',
    date: '2024-03-11',
    status: 'completed',
  },
  {
    id: 3,
    description: 'Private Class - Maria Santos',
    amount: 80,
    type: 'income',
    category: 'Classes',
    date: '2024-03-10',
    status: 'pending',
  },
  {
    id: 4,
    description: 'Utility Bill - Electricity',
    amount: 250,
    type: 'expense',
    category: 'Utilities',
    date: '2024-03-09',
    status: 'completed',
  },
];

const TransactionHistory = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Transaction
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg mr-3 ${
                      transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'income' ? (
                        <ArrowUpRight className={`w-5 h-5 text-green-600`} />
                      ) : (
                        <ArrowDownRight className={`w-5 h-5 text-red-600`} />
                      )}
                    </div>
                    <span className="font-medium text-gray-900">
                      {transaction.description}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`font-medium ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    transaction.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;