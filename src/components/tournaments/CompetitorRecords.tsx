import React from 'react';
import { Medal, Trophy, MoreVertical, Target, Clock } from 'lucide-react';
import { getBeltColor } from '../../utils/beltUtils';

const competitors = [
  {
    id: 1,
    name: 'John Silva',
    belt: 'purple',
    division: 'Adult Male / Middleweight',
    tournaments: 12,
    wins: 18,
    losses: 4,
    winPercentage: '82%',
    medals: {
      gold: 4,
      silver: 3,
      bronze: 2,
    },
    submissions: {
      total: 12,
      fastest: '1:45',
      favorite: 'Triangle',
    },
    recentResult: 'Gold - State Championship 2024',
  },
  {
    id: 2,
    name: 'Maria Santos',
    belt: 'blue',
    division: 'Adult Female / Lightweight',
    tournaments: 8,
    wins: 12,
    losses: 3,
    winPercentage: '80%',
    medals: {
      gold: 3,
      silver: 2,
      bronze: 1,
    },
    submissions: {
      total: 8,
      fastest: '2:30',
      favorite: 'Armbar',
    },
    recentResult: 'Silver - Regional Open 2024',
  },
  {
    id: 3,
    name: 'Alex Thompson',
    belt: 'brown',
    division: 'Adult Male / Heavyweight',
    tournaments: 15,
    wins: 22,
    losses: 6,
    winPercentage: '79%',
    medals: {
      gold: 5,
      silver: 4,
      bronze: 3,
    },
    submissions: {
      total: 15,
      fastest: '0:23',
      favorite: 'Flying Armbar',
    },
    recentResult: 'Gold - National Pro 2024',
  },
];

const CompetitorRecords = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Competitor Records</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Competitor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Division
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Record
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Submissions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Medals
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Recent Result
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {competitors.map((competitor) => (
              <tr key={competitor.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`w-6 h-6 ${getBeltColor(competitor.belt)} rounded-full mr-2`} />
                    <div>
                      <span className="font-medium text-gray-900">{competitor.name}</span>
                      <p className="text-xs text-gray-500">{competitor.winPercentage} win rate</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {competitor.division}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <span className="font-medium text-green-600">{competitor.wins}W</span>
                    {' - '}
                    <span className="font-medium text-red-600">{competitor.losses}L</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {competitor.tournaments} tournaments
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Target className="w-4 h-4 text-indigo-600 mr-1" />
                      <span className="text-sm">{competitor.submissions.total}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm">{competitor.submissions.fastest}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Favorite: {competitor.submissions.favorite}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      <span className="ml-1 text-sm">{competitor.medals.gold}</span>
                    </div>
                    <div className="flex items-center">
                      <Trophy className="w-4 h-4 text-gray-400" />
                      <span className="ml-1 text-sm">{competitor.medals.silver}</span>
                    </div>
                    <div className="flex items-center">
                      <Trophy className="w-4 h-4 text-amber-700" />
                      <span className="ml-1 text-sm">{competitor.medals.bronze}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Medal className="w-4 h-4 text-indigo-600 mr-2" />
                    <span className="text-sm">{competitor.recentResult}</span>
                  </div>
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

export default CompetitorRecords;