import React, { useState } from 'react';
import { MoreVertical, Edit, UserMinus, Award, Eye, Trash2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { CreateMemberForm } from './forms/CreateMemberForm';
import { MemberEditForm } from './forms/MemberEditForm';
import { BeltPromotionForm } from './forms/BeltPromotionForm';
import type { Member } from '../../types/member';

interface MemberActionsProps {
  member: Member;
  onView: (member: Member) => void;
  onEdit: (data: Partial<Member>) => Promise<void>;
  onPromote: (data: { belt: string; stripes: number }) => Promise<void>;
  onDelete: () => Promise<void>;
}

export function MemberActions({
  member,
  onView,
  onEdit,
  onPromote,
  onDelete
}: MemberActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
          onSubmit={async (data) => {
            await onEdit(data);
            setShowEditModal(false);
          }}
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
          onSubmit={async (data) => {
            await onPromote(data);
            setShowPromoteModal(false);
          }}
          onCancel={() => setShowPromoteModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete {member.fullName}?</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                await onDelete();
                setShowDeleteConfirm(false);
              }}
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