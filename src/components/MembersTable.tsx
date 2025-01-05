import React from 'react';
import { MoreVertical, Mail, Phone, Award } from 'lucide-react';

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  belt: string;
  stripes: number;
  joinDate: string;
  lastAttended: string;
  status: 'active' | 'inactive';
}

const members: Member[] = [
  {
    id: 1,
    name: 'John Silva',
    email: 'john.silva@email.com',
    phone: '(555) 123-4567',
    belt: 'purple',
    stripes: 2,
    joinDate: '2022-03-15',
    lastAttended: '2024-03-10',
    status: 'active',
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria.s@email.com',
    phone: '(555) 234-5678',
    belt: 'blue',
    stripes: 4,
    joinDate: '2023-01-10',
    lastAttended: '2024-03-11',
    status: 'active',
  },
  {
    id: 3,
    name: 'Carlos Rodriguez',
    email: 'carlos.r@email.com',
    phone: '(555) 345-6789',
    belt: 'brown',
    stripes: 1,
    joinDate: '2021-06-20',
    lastAttended: '2024-03-12',
    status: 'active',
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

const MembersTable = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Member
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Belt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Join Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Attended
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{member.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail className="w-4 h-4 mr-1" />
                      {member.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="w-4 h-4 mr-1" />
                      {member.phone}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`w-6 h-6 ${getBeltColor(member.belt)} rounded-full mr-2`} />
                    <span className="text-sm text-gray-900 capitalize">{member.belt}</span>
                    <div className="ml-2 flex space-x-1">
                      {[...Array(member.stripes)].map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full" />
                      ))}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(member.joinDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(member.lastAttended).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    member.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {member.status}
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

export default MembersTable;