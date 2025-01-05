import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

const stats = [
  {
    id: 1,
    title: 'Total Revenue',
    value: '$24,500',
    change: '+12% from last month',
    icon: <DollarSign className="w-6 h-6 text-green-600" />,
    trend: 'up',
  },
  {
    id: 2,
    title: 'Total Expenses',
    value: '$8,900',
    change: '-3% from last month',
    icon: <TrendingDown className="w-6 h-6 text-red-600" />,
    trend: 'down',
  },
  {
    id: 3,
    title: 'Net Profit',
    value: '$15,600',
    change: '+18% from last month',
    icon: <TrendingUp className="w-6 h-6 text-indigo-600" />,
    trend: 'up',
  },
  {
    id: 4,
    title: 'Outstanding Payments',
    value: '$2,300',
    change: '8 members',
    icon: <Wallet className="w-6 h-6 text-amber-600" />,
    trend: 'neutral',
  },
];

const FinancialStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat) => (
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