import React from 'react';
import { Modal } from '../ui/Modal';
import { useForm } from '../../hooks/useForm';
import { useToast } from '../../contexts/ToastContext';
import { createMember } from '../../lib/members';
import type { CreateMemberData } from '../../lib/members';

interface CreateMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateMemberModal({ isOpen, onClose, onSuccess }: CreateMemberModalProps) {
  const { showToast } = useToast();

  const { values, handleChange, handleSubmit, loading, errors } = useForm<CreateMemberData>({
    initialValues: {
      fullName: '',
      email: '',
      belt: 'white',
      stripes: 0,
      status: 'active',
    },
    onSubmit: async (data) => {
      try {
        await createMember(data);
        showToast('success', 'Member created successfully');
        onSuccess();
        onClose();
      } catch (error: any) {
        console.error('Failed to create member:', error);
        if (error.message.includes('already exists')) {
          throw new Error('A member with this email already exists');
        }
        throw new Error('Failed to create member. Please try again.');
      }
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Member">
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.form && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {errors.form}
          </div>
        )}

        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={values.fullName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="belt" className="block text-sm font-medium text-gray-700">
            Belt
          </label>
          <select
            id="belt"
            name="belt"
            value={values.belt}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="white">White</option>
            <option value="blue">Blue</option>
            <option value="purple">Purple</option>
            <option value="brown">Brown</option>
            <option value="black">Black</option>
          </select>
        </div>

        <div>
          <label htmlFor="stripes" className="block text-sm font-medium text-gray-700">
            Stripes
          </label>
          <select
            id="stripes"
            name="stripes"
            value={values.stripes}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {[0, 1, 2, 3, 4].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Member'}
          </button>
        </div>
      </form>
    </Modal>
  );
}