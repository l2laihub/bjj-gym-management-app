import React from 'react';
import { Users, TrendingUp, Clock, Award } from 'lucide-react';
import { useMembers } from '../../hooks/useMembers';

export function MemberStats() {
  const { members = [], loading } = useMembers();
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
            <div className="flex justify-between">
              <div className="space-y-3">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-8 w-16 bg-gray-300 rounded"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </div>
              <div className="bg-gray-200 p-3 rounded-lg w-12 h-12"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const activeMembers = members.filter(m => m.status === 'active').length;
  
  const stats = [
    {
      title: 'Total Members',
      value: members.length,
      icon: <Users className="w-6 h-6 text-indigo-600" />,
      change: '+12% this month'
    },
    {
      title: 'Active Members',
      value: activeMembers,
      icon: <TrendingUp className="w-6 h-6 text-green-600" />,
      change: '+8% this month'
    },
    {
      title: 'Avg. Attendance',
      value: '85%',
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      change: '+5% this month'
    },
    {
      title: 'Belt Promotions',
      value: '8',
      icon: <Award className="w-6 h-6 text-purple-600" />,
      change: 'This month'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
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
}