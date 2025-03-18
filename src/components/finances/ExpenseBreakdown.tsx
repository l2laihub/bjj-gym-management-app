import { FC } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useFinance } from '../../hooks/useFinance';
import { formatCurrency } from '../../lib/utils/formatters';

// Define colors for the pie chart segments
const COLORS = ['#4f46e5', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#6b7280', '#ec4899', '#14b8a6', '#f43f5e', '#0ea5e9'];

const ExpenseBreakdown: FC = () => {
  const { stats, isLoading } = useFinance();

  // If stats aren't loaded yet, show loading state
  if (isLoading || !stats) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Expense Breakdown</h2>
        <div className="h-[300px] flex items-center justify-center">
          <div className="animate-pulse w-full">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6 mx-auto"></div>
            <div className="h-40 bg-gray-200 rounded-full w-40 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Filter top categories to only include expense categories
  const expenseCategories = stats.topCategories
    .filter(category => {
      // Find transactions for this category that are expenses
      const categoryTransactions = stats.recentTransactions.filter(
        t => t.category === category.name && t.type === 'expense'
      );
      return categoryTransactions.length > 0;
    })
    .map((category, index) => ({
      name: category.name,
      value: category.amount,
      color: COLORS[index % COLORS.length]
    }));

  // If no expense categories, show a message
  if (expenseCategories.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Expense Breakdown</h2>
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-gray-500">No expense data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Expense Breakdown</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={expenseCategories}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {expenseCategories.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(value as number)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseBreakdown;