import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import type { ProspectFilters } from '../../types/prospect';

interface ProspectsFiltersProps {
  filters: ProspectFilters;
  onFilterChange: (filters: ProspectFilters) => void;
}

export function ProspectsFilters({ filters, onFilterChange }: ProspectsFiltersProps) {
  const [search, setSearch] = useState(filters.search || '');
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== filters.search) {
        onFilterChange({ ...filters, search });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, filters, onFilterChange]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ 
      ...filters, 
      status: e.target.value || undefined 
    });
  };

  const handleInterestChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ 
      ...filters, 
      interestLevel: e.target.value || undefined 
    });
  };

  const clearFilters = () => {
    setSearch('');
    onFilterChange({});
    setShowFilters(false);
  };

  const hasActiveFilters = filters.status || filters.interestLevel || filters.search;

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search prospects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2 border rounded-lg flex items-center ${
            hasActiveFilters 
              ? 'border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter className="w-5 h-5 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
              {Object.values(filters).filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                value={filters.status || ''}
                onChange={handleStatusChange}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Statuses</option>
                <option value="Initial Contact">Initial Contact</option>
                <option value="Trial Scheduled">Trial Scheduled</option>
                <option value="Trial Active">Trial Active</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
            
            <div className="flex-1">
              <label htmlFor="interestLevel" className="block text-sm font-medium text-gray-700 mb-1">
                Interest Level
              </label>
              <select
                id="interestLevel"
                value={filters.interestLevel || ''}
                onChange={handleInterestChange}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Interest Levels</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}