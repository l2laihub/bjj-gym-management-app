import React from 'react';
import { useForm } from '../../../hooks/useForm';
import { useToast } from '../../../contexts/ToastContext';
import { upsertMedicalInfo } from '../../../lib/members/mutations';
import type { MedicalInfo } from '../../../types/member';

interface MedicalInfoFormProps {
  memberId: string;
  initialData?: MedicalInfo;
  onSuccess: () => void;
  onCancel: () => void;
}

export function MedicalInfoForm({ memberId, initialData, onSuccess, onCancel }: MedicalInfoFormProps) {
  const { showToast } = useToast();

  const { values, handleChange, handleSubmit, loading, errors } = useForm<MedicalInfo>({
    initialValues: initialData || {
      conditions: [],
      allergies: [],
      medications: [],
      bloodType: '',
      notes: '',
    },
    onSubmit: async (data) => {
      try {
        await upsertMedicalInfo(memberId, data);
        showToast('success', `Medical information ${initialData ? 'updated' : 'added'} successfully`);
        onSuccess();
      } catch (error) {
        console.error('Failed to save medical information:', error);
        throw new Error('Failed to save medical information');
      }
    },
  });

  const handleArrayChange = (e: React.ChangeEvent<HTMLTextAreaElement>, field: 'conditions' | 'allergies' | 'medications') => {
    const items = e.target.value.split('\n').filter(item => item.trim());
    handleChange({
      target: {
        name: field,
        value: items,
      },
    } as any);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.form && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {errors.form}
        </div>
      )}

      <div>
        <label htmlFor="conditions" className="block text-sm font-medium text-gray-700">
          Medical Conditions
        </label>
        <p className="text-sm text-gray-500 mb-1">One condition per line</p>
        <textarea
          id="conditions"
          name="conditions"
          value={values.conditions.join('\n')}
          onChange={(e) => handleArrayChange(e, 'conditions')}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={3}
        />
      </div>

      <div>
        <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">
          Allergies
        </label>
        <p className="text-sm text-gray-500 mb-1">One allergy per line</p>
        <textarea
          id="allergies"
          name="allergies"
          value={values.allergies.join('\n')}
          onChange={(e) => handleArrayChange(e, 'allergies')}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={3}
        />
      </div>

      <div>
        <label htmlFor="medications" className="block text-sm font-medium text-gray-700">
          Current Medications
        </label>
        <p className="text-sm text-gray-500 mb-1">One medication per line</p>
        <textarea
          id="medications"
          name="medications"
          value={values.medications.join('\n')}
          onChange={(e) => handleArrayChange(e, 'medications')}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={3}
        />
      </div>

      <div>
        <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700">
          Blood Type
        </label>
        <select
          id="bloodType"
          name="bloodType"
          value={values.bloodType}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select Blood Type</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Additional Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={values.notes}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={3}
          placeholder="Any additional medical information..."
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
          {loading ? 'Saving...' : initialData ? 'Update Medical Info' : 'Add Medical Info'}
        </button>
      </div>
    </form>
  );
}