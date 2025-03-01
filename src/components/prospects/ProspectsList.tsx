import React, { useState, useEffect } from 'react';
import { MoreVertical, Mail, Phone, Calendar, Edit, Trash2, Eye } from 'lucide-react';
import { useProspects } from '../../hooks/useProspects';
import { useToast } from '../../contexts/ToastContext';
import { deleteProspect } from '../../lib/prospects';
import { Modal } from '../ui/Modal';
import type { ProspectFilters, Prospect } from '../../types/prospect';

interface ProspectsListProps {
  filters: ProspectFilters;
  onEdit?: (prospect: Prospect) => void;
  onView?: (prospect: Prospect) => void;
}

export function ProspectsList({ filters, onEdit, onView }: ProspectsListProps) {
  const { prospects, loading, error, refetch } = useProspects(filters);
  const { showToast } = useToast();
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const [prevProspectsLength, setPrevProspectsLength] = useState(0);

  // Track changes in the prospects list length to detect additions
  useEffect(() => {
    if (prospects.length > prevProspectsLength && prevProspectsLength > 0) {
      // A new prospect was added
      showToast('success', 'Prospect list updated with new data');
    }
    setPrevProspectsLength(prospects.length);
  }, [prospects.length, prevProspectsLength, showToast]);

  const handleDelete = async (id: string) => {
    try {
      await deleteProspect(id);
      showToast('success', 'Prospect deleted successfully');
      setShowDeleteConfirm(false);
      refetch();
    } catch (error) {
      showToast('error', 'Failed to delete prospect');
    }
  };

  const toggleActionMenu = (id: string | null) => {
    setActionMenuOpen(prev => prev === id ? null : id);
  };

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (actionMenuOpen) {
        setActionMenuOpen(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [actionMenuOpen]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
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

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Active Prospects</h2>
        </div>
        {prospects.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No prospects found. Add your first prospect to get started.
          </div>
        ) : (
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
                        <div className="font-medium text-gray-900">{prospect.full_name}</div>
                        <div className="text-sm text-gray-500 flex flex-col">
                          {prospect.email && (
                            <span className="flex items-center">
                              <Mail className="w-4 h-4 mr-1" />
                              {prospect.email}
                            </span>
                          )}
                          {prospect.phone && (
                            <span className="flex items-center">
                              <Phone className="w-4 h-4 mr-1" />
                              {prospect.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {prospect.source || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getInterestLevelColor(prospect.interest_level)}`}>
                        {prospect.interest_level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {prospect.trial_package || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {prospect.next_follow_up ? (
                          <div className="flex items-center text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(prospect.next_follow_up).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-gray-400">Not scheduled</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prospect.status)}`}>
                        {prospect.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleActionMenu(prospect.id);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      {actionMenuOpen === prospect.id && (
                        <div 
                          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {onView && (
                            <button
                              onClick={() => {
                                onView(prospect);
                                toggleActionMenu(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </button>
                          )}
                          {onEdit && (
                            <button
                              onClick={() => {
                                onEdit(prospect);
                                toggleActionMenu(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedProspect(prospect);
                              setShowDeleteConfirm(true);
                              toggleActionMenu(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Prospect"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete {selectedProspect?.full_name}? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => selectedProspect && handleDelete(selectedProspect.id)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}