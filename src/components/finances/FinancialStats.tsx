import { FC } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useFinance } from '../../hooks/useFinance';
import { formatCurrency } from '../../lib/utils/formatters';

const FinancialStats: FC = () => {
  const { stats, loading } = useFinance();

  // If stats aren't loaded yet, show loading state
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[1, 2, 3, 4].map((id) => (
          <div key={id} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  // Define the stats cards with real data
  const statsCards = [
    {
      id: 1,
      title: 'Total Revenue',
      value: formatCurrency(stats.totalIncome),
      change: stats.topCategories.length > 0 ? `${stats.topCategories[0].name}: ${formatCurrency(stats.topCategories[0].amount)}` : 'No data',
      icon: <DollarSign className="w-6 h-6 text-green-600" />,
      trend: 'up',
    },
    {
      id: 2,
      title: 'Total Expenses',
      value: formatCurrency(stats.totalExpenses),
      change: `${stats.pendingExpenses > 0 ? formatCurrency(stats.pendingExpenses) + ' pending' : 'No pending expenses'}`,
      icon: <TrendingDown className="w-6 h-6 text-red-600" />,
      trend: 'down',
    },
    {
      id: 3,
      title: 'Net Income',
      value: formatCurrency(stats.netIncome),
      change: `${stats.netIncome > 0 ? 'Profitable' : 'Loss'}`,
      icon: <TrendingUp className="w-6 h-6 text-indigo-600" />,
      trend: stats.netIncome > 0 ? 'up' : 'down',
    },
    {
      id: 4,
      title: 'Pending Income',
      value: formatCurrency(stats.pendingIncome),
      change: `${stats.recentTransactions.filter(t => t.status === 'pending' && t.type === 'income').length} transactions`,
      icon: <Wallet className="w-6 h-6 text-amber-600" />,
      trend: 'neutral',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statsCards.map((stat) => (
        <div key={stat.id} className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
              <p className={`text-sm mt-1 ${
                stat.trend === 'up' ? 'text-green-500' : 
                stat.trend === 'down' ? 'text-red-500' : 
                'text-gray-500'
              }`}>
                {stat.change}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FinancialStats;