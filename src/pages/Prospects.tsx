import React, { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { ProspectStats } from '../components/prospects/ProspectStats';
import { ProspectsList } from '../components/prospects/ProspectsList';
import { FollowUpTasks } from '../components/prospects/FollowUpTasks';
import { ProspectsFilters } from '../components/prospects/ProspectsFilters';
import { ProspectForm } from '../components/prospects/ProspectForm';
import { Modal } from '../components/ui/Modal';
import { createProspect, updateProspect } from '../lib/prospects';
import { useToast } from '../contexts/ToastContext';
import type { ProspectFilters as ProspectFiltersType, Prospect } from '../types/prospect';
import PageContainer from '../components/layout/PageContainer';
import PageHeader from '../components/layout/PageHeader';

const Prospects = () => {
  const [filters, setFilters] = useState<ProspectFiltersType>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Add a refresh key to trigger re-renders
  const { showToast } = useToast();

  const handleAddProspect = async (data: any) => {
    try {
      await createProspect(data);
      showToast('success', 'Prospect created successfully');
      setShowAddModal(false);
      // Increment refresh key to trigger a re-render of the ProspectsList component
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error creating prospect:', error);
      showToast('error', 'Failed to create prospect');
      throw error;
    }
  };

  const handleEditProspect = async (data: any) => {
    if (!selectedProspect) return;
    
    try {
      await updateProspect(selectedProspect.id, data);
      showToast('success', 'Prospect updated successfully');
      setShowEditModal(false);
      setSelectedProspect(null);
      // Increment refresh key to trigger a re-render of the ProspectsList component
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error updating prospect:', error);
      showToast('error', 'Failed to update prospect');
      throw error;
    }
  };

  const handleEdit = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setShowEditModal(true);
  };

  return (
    <PageContainer>
      <PageHeader 
        title="Prospects"
        description="Manage potential members and trial participants"
      >
        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
          <Download className="w-5 h-5 mr-2" />
          Export List
        </button>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Prospect
        </button>
      </PageHeader>

      <ProspectStats key={`stats-${refreshKey}`} />
      
      <ProspectsFilters 
        filters={filters}
        onFilterChange={setFilters}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <ProspectsList 
            key={`list-${refreshKey}`}
            filters={filters}
            onEdit={handleEdit}
          />
        </div>
        <div>
          <FollowUpTasks key={`tasks-${refreshKey}`} />
        </div>
      </div>

      {/* Add Prospect Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Prospect"
      >
        <ProspectForm
          onSubmit={handleAddProspect}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      {/* Edit Prospect Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedProspect(null);
        }}
        title="Edit Prospect"
      >
        {selectedProspect && (
          <ProspectForm
            initialData={selectedProspect}
            onSubmit={handleEditProspect}
            onCancel={() => {
              setShowEditModal(false);
              setSelectedProspect(null);
            }}
            isEdit
          />
        )}
      </Modal>
    </PageContainer>
  );
};

export default Prospects;