import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';

const lowStockItems = [
  {
    id: 1,
    name: 'Kids Gi (White)',
    inStock: 12,
    reorderPoint: 15,
    status: 'warning',
  },
  {
    id: 2,
    name: 'Rash Guard (L)',
    inStock: 8,
    reorderPoint: 10,
    status: 'critical',
  },
  {
    id: 3,
    name: 'BJJ Belt - Purple',
    inStock: 5,
    reorderPoint: 8,
    status: 'warning',
  },
  {
    id: 4,
    name: 'Competition Shorts',
    inStock: 3,
    reorderPoint: 10,
    status: 'critical',
  },
];

const LowStockAlert = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Low Stock Alerts</h2>
        <div className="bg-amber-100 p-2 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
        </div>
      </div>
      
      <div className="space-y-4">
        {lowStockItems.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-lg border ${
              item.status === 'critical' ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {item.inStock} in stock / {item.reorderPoint} minimum
                </p>
              </div>
              <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                Reorder
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t">
        <button className="w-full flex items-center justify-center px-4 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100">
          View All Alerts
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default LowStockAlert;