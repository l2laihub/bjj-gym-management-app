import React from 'react';
import { Search, Filter } from 'lucide-react';
import type { MemberFilters } from '../../types/member';

interface MemberFiltersProps {
  filters: MemberFilters;
  onFilterChange: (filters: MemberFilters) => void;
}

export function MemberFilters({ filters, onFilterChange }: MemberFiltersProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ 
      ...filters, 
      status: e.target.value as 'active' | 'inactive' | undefined 
    });
  };

  const handleBeltChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ 
      ...filters, 
      belt: e.target.value || undefined 
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1 relative">
        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search members..."
          value={filters.search || ''}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      
      <div className="flex gap-4">
        <select
          value={filters.status || ''}
          onChange={handleStatusChange}
          className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select
          value={filters.belt || ''}
          onChange={handleBeltChange}
          className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Belts</option>
          <option value="white">White</option>
          <option value="blue">Blue</option>
          <option value="purple">Purple</option>
          <option value="brown">Brown</option>
          <option value="black">Black</option>
        </select>
      </div>
    </div>
  );
}