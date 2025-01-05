import React from 'react';
import { Trophy, Medal, Users, Award, Clock, Target, Percent, Star } from 'lucide-react';

const stats = [
  {
    id: 1,
    title: 'Total Medals',
    value: '156',
    breakdown: '52 Gold • 48 Silver • 56 Bronze',
    icon: <Trophy className="w-6 h-6 text-amber-600" />,
  },
  {
    id: 2,
    title: 'Win Rate',
    value: '72%',
    breakdown: '248 wins out of 345 matches',
    icon: <Medal className="w-6 h-6 text-indigo-600" />,
  },
  {
    id: 3,
    title: 'Active Competitors',
    value: '28',
    breakdown: '18% of total members',
    icon: <Users className="w-6 h-6 text-green-600" />,
  },
  {
    id: 4,
    title: 'Fastest Sub',
    value: '0:23',
    breakdown: 'Flying armbar by Alex Thompson',
    icon: <Clock className="w-6 h-6 text-purple-600" />,
  },
];

const performanceStats = [
  {
    id: 1,
    title: 'Most Wins',
    value: 'Alex Thompson',
    stat: '22 wins',
    icon: <Star className="w-6 h-6 text-amber-600" />,
  },
  {
    id: 2,
    title: 'Submission Rate',
    value: '65%',
    stat: '160 submissions / 248 wins',
    icon: <Target className="w-6 h-6 text-red-600" />,
  },
  {
    id: 3,
    title: 'Best Win %',
    value: 'Maria Santos',
    stat: '80% (12-3)',
    icon: <Percent className="w-6 h-6 text-green-600" />,
  },
  {
    id: 4,
    title: 'Most Active',
    value: 'John Silva',
    stat: '15 tournaments in 2024',
    icon: <Award className="w-6 h-6 text-blue-600" />,
  },
];

const TournamentStats = () => {
  return (
    <div className="space-y-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.breakdown}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceStats.map((stat) => (
          <div key={stat.id} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.stat}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TournamentStats;