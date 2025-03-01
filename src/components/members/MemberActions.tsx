import React, { useState } from 'react';
import { MoreVertical, Edit, Award, Eye, Trash2, AlertTriangle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { MemberEditForm } from './forms/MemberEditForm';
import { BeltPromotionForm } from './forms/BeltPromotionForm';
import { updateMember, updateMemberBelt, deleteMember } from '../../lib/members';
import { useToast } from '../../contexts/ToastContext';
import type { Member } from '../../types/member';

interface MemberActionsProps {
  member: Member;
  onView: (member: Member) => void;
  onUpdate: () => void;
}

export function MemberActions({ member, onView, onUpdate }: MemberActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleEdit = async (data: Partial<Member>) => {
    try {
      setLoading(true);
      await updateMember(member.id, data);
      showToast('success', 'Member updated successfully');
      onUpdate();
      setShowEditModal(false);
    } catch (error) {
      console.error('Failed to update member:', error);
      showToast('error', 'Failed to update member');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async (data: { belt: string; stripes: number }) => {
    try {
      setLoading(true);
      await updateMemberBelt(member.id, data);
      showToast('success', 'Member promoted successfully');
      onUpdate();
      setShowPromoteModal(false);
    } catch (error) {
      console.error('Failed to promote member:', error);
      showToast('error', 'Failed to promote member');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteMember(member.id);
      showToast('success', 'Member deleted successfully');
      onUpdate();
      setShowDeleteConfirm(false);
    } catch (error: any) {
      console.error('Failed to delete member:', error);
      showToast('error', error.message || 'Failed to delete member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <MoreVertical className="w-5 h-5 text-gray-500" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
            <button
              onClick={() => { onView(member); setIsOpen(false); }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </button>
            <button
              onClick={() => { setShowEditModal(true); setIsOpen(false); }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Member
            </button>
            <button
              onClick={() => { setShowPromoteModal(true); setIsOpen(false); }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <Award className="w-4 h-4 mr-2" />
              Promote
            </button>
            <button
              onClick={() => { setShowDeleteConfirm(true); setIsOpen(false); }}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Member"
      >
        <MemberEditForm
          member={member}
          onSubmit={handleEdit}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showPromoteModal}
        onClose={() => setShowPromoteModal(false)}
        title="Belt Promotion"
      >
        <BeltPromotionForm
          member={member}
          onSubmit={handlePromote}
          onCancel={() => setShowPromoteModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Member"
      >
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-900">Delete Member Account</h3>
              <p className="text-sm text-red-700 mt-1">
                This action will permanently delete {member.fullName}'s account and all associated data. This cannot be undone.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {loading ? 'Deleting...' : 'Delete Member'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}