import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { memberSchema } from '../../schemas/member';
import type { MemberFormData } from '../../types/member';

interface MemberFormProps {
  initialData?: Partial<MemberFormData>;
  onSubmit: (data: MemberFormData) => Promise<void>;
  isLoading?: boolean;
}

export function MemberForm({ initialData, onSubmit, isLoading }: MemberFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          {...register('fullName')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="belt" className="block text-sm font-medium text-gray-700">
          Belt
        </label>
        <select
          id="belt"
          {...register('belt')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select Belt</option>
          <option value="white">White</option>
          <option value="blue">Blue</option>
          <option value="purple">Purple</option>
          <option value="brown">Brown</option>
          <option value="black">Black</option>
        </select>
        {errors.belt && (
          <p className="mt-1 text-sm text-red-600">{errors.belt.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="stripes" className="block text-sm font-medium text-gray-700">
          Stripes
        </label>
        <input
          type="number"
          id="stripes"
          min="0"
          max="4"
          {...register('stripes', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.stripes && (
          <p className="mt-1 text-sm text-red-600">{errors.stripes.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
          {...register('status')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
        )}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Member'}
        </button>
      </div>
    </form>
  );
}