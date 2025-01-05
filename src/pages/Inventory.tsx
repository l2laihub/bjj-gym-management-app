import React from 'react';
import InventoryHeader from '../components/inventory/InventoryHeader';
import InventoryStats from '../components/inventory/InventoryStats';
import InventoryList from '../components/inventory/InventoryList';
import LowStockAlert from '../components/inventory/LowStockAlert';

const Inventory = () => {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <InventoryHeader />
        <InventoryStats />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <InventoryList />
          </div>
          <div>
            <LowStockAlert />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;