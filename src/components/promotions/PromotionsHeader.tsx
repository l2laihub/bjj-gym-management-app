import React from 'react';
import { Plus, Calendar } from 'lucide-react';

const PromotionsHeader = () => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promotions</h1>
          <p className="text-gray-500">Track and manage belt promotions and stripes</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Schedule Ceremony
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Record Promotion
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromotionsHeader;