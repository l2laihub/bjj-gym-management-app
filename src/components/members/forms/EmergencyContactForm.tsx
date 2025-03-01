import React from 'react';
import { useForm } from '../../../hooks/useForm';
import { useToast } from '../../../contexts/ToastContext';
import { upsertEmergencyContact } from '../../../lib/members/mutations';
import type { EmergencyContact } from '../../../types/member';

interface EmergencyContactFormProps {
  memberId: string;
  initialData?: EmergencyContact;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EmergencyContactForm({ memberId, initialData, onSuccess, onCancel }: EmergencyContactFormProps) {
  const { showToast } = useToast();

  const { values, handleChange, handleSubmit, loading, errors } = useForm<EmergencyContact>({
    initialValues: initialData || {
      name: '',
      relationship: '',
      phone: '',
      email: '',
    },
    onSubmit: async (data) => {
      try {
        await upsertEmergencyContact(memberId, data);
        showToast('success', `Emergency contact ${initialData ? 'updated' : 'added'} successfully`);
        onSuccess();
      } catch (error) {
        console.error('Failed to save emergency contact:', error);
        throw new Error('Failed to save emergency contact');
      }
    },
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.form && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {errors.form}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={values.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="relationship" className="block text-sm font-medium text-gray-700">
          Relationship
        </label>
        <input
          type="text"
          id="relationship"
          name="relationship"
          value={values.relationship}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={values.phone}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email (Optional)
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : initialData ? 'Update Contact' : 'Add Contact'}
        </button>
      </div>
    </form>
  );
}