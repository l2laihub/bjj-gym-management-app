import React from 'react';
import { Plus, Download, Filter } from 'lucide-react';

const ProspectsHeader = () => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prospects</h1>
          <p className="text-gray-500">Manage potential members and trial participants</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Export List
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Add Prospect
          </button>
        </div>
      </div>
      
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search prospects..."
            className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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

export default ProspectsHeader;