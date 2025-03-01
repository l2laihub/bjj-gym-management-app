import React, { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import PageHeader from '../components/layout/PageHeader';
import { MemberStats } from '../components/members/MemberStats';
import { MemberFilters } from '../components/members/MemberFilters';
import { MemberList } from '../components/members/MemberList';
import { CreateMemberModal } from '../components/members/CreateMemberModal';
import type { MemberFilters as MemberFiltersType } from '../types/member';

const Members = () => {
  const [filters, setFilters] = useState<MemberFiltersType>({});
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <PageContainer>
      <PageHeader 
        title="Members"
        description="Manage your gym members and their information"
      >
        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
          <Download className="w-5 h-5 mr-2" />
          Export List
        </button>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Member
        </button>
      </PageHeader>

      <div className="space-y-6">
        <MemberStats />
        <MemberFilters 
          filters={filters}
          onFilterChange={setFilters}
        />
        <MemberList filters={filters} />
      </div>

      <CreateMemberModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          // Refresh member list
          window.location.reload();
        }}
      />
    </PageContainer>
  );
};

export default Members;