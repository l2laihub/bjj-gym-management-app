import React from 'react'

interface TechniqueFiltersProps {
  filters: {
    search: string
    category: string
    beltLevel: string
    status: string
    sortBy: string
  }
  onFilterChange: (name: string, value: string) => void
}

export const TechniqueFilters: React.FC<TechniqueFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Search
          </label>
          <input
            type="text"
            id="search"
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Search techniques..."
          />
        </div>

        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">All Categories</option>
            {['Guard', 'Mount', 'Side Control', 'Back Control', 'Takedowns', 'Submissions'].map(
              (category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              )
            )}
          </select>
        </div>

        {/* Belt Level Filter */}
        <div>
          <label htmlFor="beltLevel" className="block text-sm font-medium text-gray-700">
            Belt Level
          </label>
          <select
            id="beltLevel"
            value={filters.beltLevel}
            onChange={(e) => onFilterChange('beltLevel', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">All Belts</option>
            {['white', 'blue', 'purple', 'brown', 'black'].map((belt) => (
              <option key={belt} value={belt}>
                {belt.charAt(0).toUpperCase() + belt.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">All Status</option>
            <option value="not_started">Not Started</option>
            <option value="learning">Learning</option>
            <option value="mastered">Mastered</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700">
            Sort By
          </label>
          <select
            id="sortBy"
            value={filters.sortBy}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="name">Name</option>
            <option value="belt_level">Belt Level</option>
            <option value="category">Category</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>
    </div>
  )
}
