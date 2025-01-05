import React from 'react';
import { Award } from 'lucide-react';
import { useForm } from '../../../hooks/useForm';
import { getBeltColor } from '../../../utils/beltUtils';
import type { Member } from '../../../types/member';

interface BeltPromotionFormProps {
  member: Member;
  onSubmit: (data: { belt: string; stripes: number }) => Promise<void>;
  onCancel: () => void;
}

const BELT_RANKS = ['white', 'blue', 'purple', 'brown', 'black'];

export function BeltPromotionForm({ member, onSubmit, onCancel }: BeltPromotionFormProps) {
  const currentBeltIndex = BELT_RANKS.indexOf(member.belt || 'white');
  const availableBelts = BELT_RANKS.slice(currentBeltIndex + 1);

  const { values, handleChange, handleSubmit, loading, errors } = useForm({
    initialValues: {
      belt: availableBelts[0] || member.belt,
      stripes: 0,
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
        <label className="block text-sm font-medium text-gray-700">Current Belt</label>
        <div className="mt-2 flex items-center">
          <div className={`w-6 h-6 ${getBeltColor(member.belt || 'white')} rounded-full mr-2`} />
          <span className="capitalize">{member.belt || 'White'} Belt</span>
          <div className="ml-2 flex space-x-1">
            {[...Array(member.stripes || 0)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="belt" className="block text-sm font-medium text-gray-700">
          New Belt
        </label>
        <select
          id="belt"
          name="belt"
          value={values.belt}
          onChange={handleChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
        >
          {availableBelts.map((belt) => (
            <option key={belt} value={belt}>
              {belt.charAt(0).toUpperCase() + belt.slice(1)} Belt
            </option>
          ))}
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
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
        >
          {[0, 1, 2, 3, 4].map((num) => (
            <option key={num} value={num}>
              {num} {num === 1 ? 'Stripe' : 'Stripes'}
            </option>
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
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center"
        >
          <Award className="w-5 h-5 mr-2" />
          {loading ? 'Promoting...' : 'Promote'}
        </button>
      </div>
    </form>
  );
}