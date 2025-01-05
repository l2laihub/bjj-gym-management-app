import React from 'react';
import { MoreVertical, Mail, Phone, Calendar, Star } from 'lucide-react';

const prospects = [
  {
    id: 1,
    name: 'Michael Chen',
    email: 'michael.c@email.com',
    phone: '(555) 123-4567',
    source: 'Google Search',
    interestLevel: 'High',
    trialPackage: '1 Week Free Trial',
    firstContact: '2024-03-10',
    nextFollowUp: '2024-03-15',
    notes: 'Previous martial arts experience, very enthusiastic',
    status: 'Trial Active',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '(555) 234-5678',
    source: 'Referral',
    interestLevel: 'Medium',
    trialPackage: '3 Class Trial',
    firstContact: '2024-03-08',
    nextFollowUp: '2024-03-16',
    notes: 'Interested in fitness aspects',
    status: 'Initial Contact',
  },
  {
    id: 3,
    name: 'David Kim',
    email: 'david.k@email.com',
    phone: '(555) 345-6789',
    source: 'Instagram Ad',
    interestLevel: 'High',
    trialPackage: '1 Week Free Trial',
    firstContact: '2024-03-12',
    nextFollowUp: '2024-03-14',
    notes: 'Looking to compete in the future',
    status: 'Trial Scheduled',
  },
];

const getInterestLevelColor = (level: string) => {
  const colors = {
    High: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-red-100 text-red-800',
  };
  return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

const getStatusColor = (status: string) => {
  const colors = {
    'Trial Active': 'bg-indigo-100 text-indigo-800',
    'Initial Contact': 'bg-blue-100 text-blue-800',
    'Trial Scheduled': 'bg-purple-100 text-purple-800',
    'Converted': 'bg-green-100 text-green-800',
    'Lost': 'bg-gray-100 text-gray-800',
  };
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

const ProspectsList = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Active Prospects</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Prospect
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Interest
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Trial Package
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Follow-up
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {prospects.map((prospect) => (
              <tr key={prospect.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-medium text-gray-900">{prospect.name}</div>
                    <div className="text-sm text-gray-500 flex flex-col">
                      <span className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {prospect.email}
                      </span>
                      <span className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {prospect.phone}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {prospect.source}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getInterestLevelColor(prospect.interestLevel)}`}>
                    {prospect.interestLevel}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {prospect.trialPackage}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <div className="flex items-center text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(prospect.nextFollowUp).toLocaleDateString()}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prospect.status)}`}>
                    {prospect.status}
                  </span>
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

export default ProspectsList;