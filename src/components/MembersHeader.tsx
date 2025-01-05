import React from 'react';
import { Plus, Search, Filter } from 'lucide-react';

const MembersHeader = () => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Members</h1>
          <p className="text-gray-500">Manage your gym members and their information</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          Add Member
        </button>
      </div>
      
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search members..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center hover:bg-gray-50">
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </button>
      </div>
    </div>
  );
};

export default MembersHeader;