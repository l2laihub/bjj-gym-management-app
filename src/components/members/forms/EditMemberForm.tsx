
import { Calendar, Users } from 'lucide-react';
import { useForm } from '../../../hooks/useForm';
import { useToast } from '../../../contexts/ToastContext';
import { updateMember } from '../../../lib/members';
import type { Member } from '../../../types/member';

interface EditMemberFormProps {
  member: Member;
  onSuccess?: () => void;
  onSubmit?: (data: Partial<Member>) => Promise<void>;
  onCancel: () => void;
}

export function EditMemberForm({ member, onSuccess, onSubmit, onCancel }: EditMemberFormProps) {
  const { showToast } = useToast();

  const { values, handleChange, handleSubmit, loading, errors } = useForm({
    initialValues: {
      fullName: member.fullName,
      email: member.email,
      status: member.status,
      birthday: member.birthday || '',
      isMinor: member.isMinor || false,
      parentName: member.parentName || '',
    },
    onSubmit: async (data) => {
      try {
        if (onSubmit) {
          // If onSubmit is provided, use it (MemberActions component)
          await onSubmit(data);
        } else {
          // Otherwise use the default behavior (MemberProfile component)
          await updateMember(member.id, data);
          showToast('success', 'Member updated successfully');
          onSuccess?.();
        }
      } catch (error) {
        console.error('Failed to update member:', error);
        throw new Error('Failed to update member');
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
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={values.status}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div>
        <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">
          Birthday
        </label>
        <div className="mt-1 relative">
          <input
            type="date"
            id="birthday"
            name="birthday"
            value={values.birthday}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-gray-300 pl-10 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <Calendar className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isMinor"
          name="isMinor"
          checked={values.isMinor}
          onChange={(e) => {
            // Use a custom event object that matches what handleChange expects
            const customEvent = {
              target: {
                name: 'isMinor',
                value: e.target.checked
              }
            };
            // @ts-expect-error - This is a simplified event object for the checkbox
            handleChange(customEvent);
          }}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="isMinor" className="ml-2 block text-sm text-gray-700">
          This member is a minor
        </label>
      </div>

      {values.isMinor && (
        <div>
          <label htmlFor="parentName" className="block text-sm font-medium text-gray-700">
            Parent/Guardian Name
          </label>
          <div className="mt-1 relative">
            <input
              type="text"
              id="parentName"
              name="parentName"
              value={values.parentName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 pl-10 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <Users className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
          </div>
        </div>
      )}

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