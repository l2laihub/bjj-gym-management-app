import React from 'react';
import { Users, Target, ThumbsUp, Clock } from 'lucide-react';

const stats = [
  {
    id: 1,
    title: 'Active Prospects',
    value: '24',
    change: '+8 this month',
    icon: <Users className="w-6 h-6 text-indigo-600" />,
  },
  {
    id: 2,
    title: 'Trial Conversion Rate',
    value: '68%',
    change: '+5% vs last month',
    icon: <Target className="w-6 h-6 text-green-600" />,
  },
  {
    id: 3,
    title: 'High Interest',
    value: '12',
    change: 'Ready to convert',
    icon: <ThumbsUp className="w-6 h-6 text-amber-600" />,
  },
  {
    id: 4,
    title: 'Pending Follow-ups',
    value: '8',
    change: 'Due this week',
    icon: <Clock className="w-6 h-6 text-red-600" />,
  },
];

const ProspectStats = () => {
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

export default ProspectStats;