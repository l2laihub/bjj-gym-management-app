import React from 'react';

const inventory = [
  { id: 1, item: 'Adult Gis', inStock: 45, reorderPoint: 20, status: 'good' },
  { id: 2, item: 'Kids Gis', inStock: 12, reorderPoint: 15, status: 'warning' },
  { id: 3, item: 'Belts', inStock: 30, reorderPoint: 25, status: 'good' },
  { id: 4, item: 'Rash Guards', inStock: 8, reorderPoint: 10, status: 'critical' },
];

const InventoryStatus = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Inventory Status</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Item</th>
              <th className="text-left py-2">In Stock</th>
              <th className="text-left py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id} className="border-b last:border-0">
                <td className="py-2">{item.item}</td>
                <td className="py-2">{item.inStock}</td>
                <td className="py-2">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs ${
                      item.status === 'good'
                        ? 'bg-green-100 text-green-800'
                        : item.status === 'warning'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryStatus;