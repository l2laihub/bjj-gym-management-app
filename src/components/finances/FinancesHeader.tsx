import React from 'react';
import { Plus, Download, Filter } from 'lucide-react';

const FinancesHeader = () => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Income & Expenses</h1>
          <p className="text-gray-500">Track and manage your gym's finances</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Export Report
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Add Transaction
          </button>
        </div>
      </div>
      
      <div className="flex space-x-4">
        <select className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
          <option>Last 30 Days</option>
          <option>This Month</option>
          <option>Last Quarter</option>
          <option>This Year</option>
        </select>
        <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center hover:bg-gray-50">
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </button>
      </div>
    </div>
  );
};

export default FinancesHeader;