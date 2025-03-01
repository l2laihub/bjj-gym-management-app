import React from 'react';
import { Users, Target, ThumbsUp, Clock } from 'lucide-react';
import { useProspectStats } from '../../hooks/useProspectStats';

export function ProspectStats() {
  const { stats, loading, error, refetch } = useProspectStats();

  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div className="text-center py-4">
          <p className="text-red-500 mb-4">Error loading prospect statistics</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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

  // Ensure stats object is properly initialized with default values
  const safeStats = {
    active_prospects: stats?.active_prospects || 0,
    conversion_rate: stats?.conversion_rate || 0,
    high_interest: stats?.high_interest || 0,
    pending_follow_ups: stats?.pending_follow_ups || 0
  };

  const statItems = [
    {
      id: 1,
      title: 'Active Prospects',
      value: safeStats.active_prospects.toString(),
      change: 'Currently active',
      icon: <Users className="w-6 h-6 text-indigo-600" />,
    },
    {
      id: 2,
      title: 'Trial Conversion Rate',
      value: `${safeStats.conversion_rate}%`,
      change: 'Of trials converted',
      icon: <Target className="w-6 h-6 text-green-600" />,
    },
    {
      id: 3,
      title: 'High Interest',
      value: safeStats.high_interest.toString(),
      change: 'Ready to convert',
      icon: <ThumbsUp className="w-6 h-6 text-amber-600" />,
    },
    {
      id: 4,
      title: 'Pending Follow-ups',
      value: safeStats.pending_follow_ups.toString(),
      change: 'Upcoming tasks',
      icon: <Clock className="w-6 h-6 text-red-600" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statItems.map((stat) => (
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
}