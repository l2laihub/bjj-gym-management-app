import React from 'react';
import { Package, DollarSign, AlertTriangle, ArrowUpDown } from 'lucide-react';

const stats = [
  {
    id: 1,
    title: 'Total Items',
    value: '486',
    icon: <Package className="w-6 h-6 text-indigo-600" />,
    change: '+24 this month',
  },
  {
    id: 2,
    title: 'Total Value',
    value: '$24,500',
    icon: <DollarSign className="w-6 h-6 text-green-600" />,
    change: '+$2,100 this month',
  },
  {
    id: 3,
    title: 'Low Stock Items',
    value: '12',
    icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
    change: 'Need attention',
  },
  {
    id: 4,
    title: 'Monthly Turnover',
    value: '85',
    icon: <ArrowUpDown className="w-6 h-6 text-blue-600" />,
    change: '+15% this month',
  },
];

const InventoryStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat) => (
        <div key={stat.id} className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
              <p className="text-sm text-green-500 mt-1">{stat.change}</p>
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

export default InventoryStats;