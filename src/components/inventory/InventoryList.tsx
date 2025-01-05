import React from 'react';
import { MoreVertical, Package } from 'lucide-react';

const inventory = [
  {
    id: 1,
    name: 'Adult Gi (White)',
    category: 'Uniforms',
    sku: 'GI-AW-001',
    inStock: 45,
    reorderPoint: 20,
    price: 89.99,
    status: 'In Stock',
  },
  {
    id: 2,
    name: 'Kids Gi (White)',
    category: 'Uniforms',
    sku: 'GI-KW-001',
    inStock: 12,
    reorderPoint: 15,
    price: 69.99,
    status: 'Low Stock',
  },
  {
    id: 3,
    name: 'BJJ Belt - Blue',
    category: 'Belts',
    sku: 'BLT-BL-001',
    inStock: 30,
    reorderPoint: 25,
    price: 29.99,
    status: 'In Stock',
  },
  {
    id: 4,
    name: 'Rash Guard (L)',
    category: 'No-Gi Gear',
    sku: 'RG-L-001',
    inStock: 8,
    reorderPoint: 10,
    price: 45.99,
    status: 'Low Stock',
  },
  {
    id: 5,
    name: 'Grappling Dummy',
    category: 'Equipment',
    sku: 'EQ-GD-001',
    inStock: 5,
    reorderPoint: 3,
    price: 199.99,
    status: 'In Stock',
  },
];

const InventoryList = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Inventory Items</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                In Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {inventory.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="bg-gray-100 p-2 rounded-lg mr-3">
                      <Package className="w-5 h-5 text-gray-600" />
                    </div>
                    <span className="font-medium text-gray-900">{item.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.sku}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.inStock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${item.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium
                    ${item.status === 'In Stock' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-amber-100 text-amber-800'
                    }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryList;