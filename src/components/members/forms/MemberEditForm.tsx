import React from 'react';
import { Mail, User, Phone } from 'lucide-react';
import { useForm } from '../../../hooks/useForm';
import type { Member } from '../../../types/member';

interface MemberEditFormProps {
  member: Member;
  onSubmit: (data: Partial<Member>) => Promise<void>;
  onCancel: () => void;
}

export function MemberEditForm({ member, onSubmit, onCancel }: MemberEditFormProps) {
  const { values, handleChange, handleSubmit, loading, errors } = useForm({
    initialValues: {
      fullName: member.fullName,
      email: member.email,
      status: member.status,
    },
    onSubmit,
  });

  return (
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
        <div className="mt-1 relative">
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={values.fullName}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
          <User className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="mt-1 relative">
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
          <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={values.status}
          onChange={handleChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
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
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}