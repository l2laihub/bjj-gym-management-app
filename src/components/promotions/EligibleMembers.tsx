import React from 'react';
import { MoreVertical, Award } from 'lucide-react';

const eligibleMembers = [
  {
    id: 1,
    name: 'Alex Thompson',
    currentBelt: 'white',
    stripes: 4,
    nextBelt: 'blue',
    timeAtBelt: '12 months',
    attendance: '85%',
    lastPromotion: '2023-03-15',
  },
  {
    id: 2,
    name: 'Sarah Chen',
    currentBelt: 'blue',
    stripes: 4,
    nextBelt: 'purple',
    timeAtBelt: '24 months',
    attendance: '90%',
    lastPromotion: '2022-03-10',
  },
  {
    id: 3,
    name: 'Mike Rodriguez',
    currentBelt: 'purple',
    stripes: 3,
    nextBelt: 'brown',
    timeAtBelt: '36 months',
    attendance: '88%',
    lastPromotion: '2021-06-20',
  },
];

const getBeltColor = (belt: string) => {
  const colors = {
    white: 'bg-gray-100',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    brown: 'bg-amber-800',
    black: 'bg-black',
  };
  return colors[belt as keyof typeof colors] || 'bg-gray-100';
};

const EligibleMembers = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Eligible for Promotion</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Member
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Current Belt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Next Belt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Time at Belt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Attendance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {eligibleMembers.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{member.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`w-6 h-6 ${getBeltColor(member.currentBelt)} rounded-full mr-2`} />
                    <span className="capitalize">{member.currentBelt}</span>
                    <div className="ml-2 flex space-x-1">
                      {[...Array(member.stripes)].map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full" />
                      ))}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`w-6 h-6 ${getBeltColor(member.nextBelt)} rounded-full mr-2`} />
                    <span className="capitalize">{member.nextBelt}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.timeAtBelt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-800">
                    {member.attendance}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-indigo-600 hover:text-indigo-900 font-medium">
                    Promote
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

export default EligibleMembers;