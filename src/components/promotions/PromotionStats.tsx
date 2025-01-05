import React from 'react';
import { Award, Clock, TrendingUp, Users } from 'lucide-react';

const stats = [
  {
    id: 1,
    title: 'Eligible for Promotion',
    value: '12',
    icon: <Award className="w-6 h-6 text-indigo-600" />,
    change: 'This month',
  },
  {
    id: 2,
    title: 'Average Time to Blue',
    value: '14 mo',
    icon: <Clock className="w-6 h-6 text-blue-600" />,
    change: '-2 months',
  },
  {
    id: 3,
    title: 'Promotion Rate',
    value: '92%',
    icon: <TrendingUp className="w-6 h-6 text-green-600" />,
    change: '+5%',
  },
  {
    id: 4,
    title: 'Next Ceremony',
    value: '8',
    icon: <Users className="w-6 h-6 text-purple-600" />,
    change: 'candidates',
  },
];

const PromotionStats = () => {
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

export default PromotionStats;