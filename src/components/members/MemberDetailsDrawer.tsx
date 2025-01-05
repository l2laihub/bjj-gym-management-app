import React from 'react';
import { X } from 'lucide-react';
import type { Member } from '../../types/member';
import { getBeltColor } from '../../utils/beltUtils';

interface MemberDetailsDrawerProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MemberDetailsDrawer({ member, isOpen, onClose }: MemberDetailsDrawerProps) {
  if (!member) return null;

  return (
    <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-xl transform transition-transform duration-300 ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className="h-full flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Member Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-sm font-medium text-gray-500">Basic Information</h3>
              <div className="mt-2 space-y-2">
                <p className="text-gray-900">{member.fullName}</p>
                <p className="text-gray-600">{member.email}</p>
                <div className="flex items-center">
                  <div className={`w-4 h-4 ${getBeltColor(member.belt || 'white')} rounded-full mr-2`} />
                  <span className="capitalize">{member.belt || 'White'} Belt</span>
                  <div className="ml-2 flex space-x-1">
                    {[...Array(member.stripes || 0)].map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <div className="mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  member.status === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {member.status}
                </span>
              </div>
            </div>

            {/* Membership */}
            <div>
              <h3 className="text-sm font-medium text-gray-500">Membership</h3>
              <div className="mt-2">
                <p className="text-gray-900">Member since: {new Date(member.joinDate).toLocaleDateString()}</p>
                {member.lastActive && (
                  <p className="text-gray-600">Last active: {new Date(member.lastActive).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t space-y-2">
          <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Edit Member
          </button>
          <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            View Full Profile
          </button>
        </div>
      </div>
    </div>
  );
}