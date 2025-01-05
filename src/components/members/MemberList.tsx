import React from 'react';
import { useMembers } from '../../hooks/useMembers';
import { MemberActions } from './MemberActions';
import { MemberDetailsDrawer } from './MemberDetailsDrawer';
import { getBeltColor } from '../../utils/beltUtils';
import type { Member, MemberFilters } from '../../types/member';

interface MemberListProps {
  filters: MemberFilters;
}

export function MemberList({ filters }: MemberListProps) {
  const { members, loading, error } = useMembers(filters);
  const [selectedMember, setSelectedMember] = React.useState<Member | null>(null);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
        {error.message}
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Belt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="font-medium text-gray-900">{member.fullName}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-6 h-6 ${getBeltColor(member.belt)} rounded-full mr-2`} />
                      <span className="capitalize">{member.belt}</span>
                      <div className="ml-2 flex space-x-1">
                        {[...Array(member.stripes)].map((_, i) => (
                          <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full" />
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      member.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <MemberActions
                      member={member}
                      onView={() => setSelectedMember(member)}
                      onEdit={async () => {}}
                      onPromote={async () => {}}
                      onDelete={async () => {}}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <MemberDetailsDrawer
        member={selectedMember}
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </>
  );
}