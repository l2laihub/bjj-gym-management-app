import React, { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import type { Prospect, CreateProspectData, UpdateProspectData } from '../../types/prospect';

interface ProspectFormProps {
  initialData?: Partial<Prospect>;
  onSubmit: (data: CreateProspectData | UpdateProspectData) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

export function ProspectForm({ initialData, onSubmit, onCancel, isEdit = false }: ProspectFormProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateProspectData>>({
    full_name: initialData?.full_name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    source: initialData?.source || '',
    interest_level: initialData?.interest_level || 'Medium',
    trial_package: initialData?.trial_package || '',
    next_follow_up: initialData?.next_follow_up ? new Date(initialData.next_follow_up).toISOString().split('T')[0] : '',
    notes: initialData?.notes || '',
    status: initialData?.status || 'Initial Contact',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.full_name?.trim()) {
      newErrors.full_name = 'Name is required';
    }
    
    if (formData.email?.trim() && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      await onSubmit(formData as CreateProspectData);
      showToast('success', `Prospect ${isEdit ? 'updated' : 'created'} successfully`);
      onCancel();
    } catch (error) {
      console.error(`Error ${isEdit ? 'updating' : 'creating'} prospect:`, error);
      showToast('error', `Failed to ${isEdit ? 'update' : 'create'} prospect`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
          Full Name *
        </label>
        <input
          type="text"
          id="full_name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-lg border ${
            errors.full_name ? 'border-red-300' : 'border-gray-300'
          } px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
          required
        />
        {errors.full_name && (
          <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-lg border ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            } px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="source" className="block text-sm font-medium text-gray-700">
            Source
          </label>
          <input
            type="text"
            id="source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            placeholder="e.g., Website, Referral, Social Media"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="interest_level" className="block text-sm font-medium text-gray-700">
            Interest Level
          </label>
          <select
            id="interest_level"
            name="interest_level"
            value={formData.interest_level}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="trial_package" className="block text-sm font-medium text-gray-700">
            Trial Package
          </label>
          <input
            type="text"
            id="trial_package"
            name="trial_package"
            value={formData.trial_package}
            onChange={handleChange}
            placeholder="e.g., 1 Week Free Trial, 3 Class Trial"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="next_follow_up" className="block text-sm font-medium text-gray-700">
            Next Follow-up Date
          </label>
          <input
            type="date"
            id="next_follow_up"
            name="next_follow_up"
            value={formData.next_follow_up}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="Initial Contact">Initial Contact</option>
          <option value="Trial Scheduled">Trial Scheduled</option>
          <option value="Trial Active">Trial Active</option>
          <option value="Converted">Converted</option>
          <option value="Lost">Lost</option>
        </select>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          value={formData.notes}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
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
          {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Prospect' : 'Create Prospect')}
        </button>
      </div>
    </form>
  );
}