import React from 'react';
import { Mail, User } from 'lucide-react';
import { useForm } from '../../../hooks/useForm';
import FormInput from '../../auth/FormInput';
import FormError from '../../auth/FormError';
import AuthButton from '../../auth/AuthButton';
import type { Member } from '../../../types/member';

interface CreateMemberFormProps {
  onSubmit: (data: Omit<Member, 'id' | 'roles'>) => Promise<void>;
  onCancel: () => void;
}

export function CreateMemberForm({ onSubmit, onCancel }: CreateMemberFormProps) {
  const { values, handleChange, handleSubmit, loading, errors } = useForm({
    initialValues: {
      fullName: '',
      email: '',
      belt: 'white',
      stripes: 0,
      status: 'active',
    },
    onSubmit,
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormError error={errors.form} />

      <FormInput
        id="fullName"
        name="fullName"
        type="text"
        label="Full name"
        value={values.fullName}
        onChange={handleChange}
        icon={User}
        autoComplete="name"
      />

      <FormInput
        id="email"
        name="email"
        type="email"
        label="Email address"
        value={values.email}
        onChange={handleChange}
        icon={Mail}
        autoComplete="email"
      />

      <div>
        <label htmlFor="belt" className="block text-sm font-medium text-gray-700">
          Belt
        </label>
        <select
          id="belt"
          name="belt"
          value={values.belt}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          {[0, 1, 2, 3, 4].map((num) => (
            <option key={num} value={num}>{num}</option>
          ))}
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
        <AuthButton type="submit" loading={loading}>
          {loading ? 'Creating...' : 'Create Member'}
        </AuthButton>
      </div>
    </form>
  );
}