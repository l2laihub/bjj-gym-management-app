import React from 'react';
import { Plus, Download } from 'lucide-react';

const CurriculumHeader = () => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">BJJ Curriculum</h1>
          <p className="text-gray-500">Structured learning path and technique requirements</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Export PDF
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Add Technique
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurriculumHeader;