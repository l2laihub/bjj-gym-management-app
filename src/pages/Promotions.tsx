import React from 'react';
import PromotionsHeader from '../components/promotions/PromotionsHeader';
import PromotionStats from '../components/promotions/PromotionStats';
import EligibleMembers from '../components/promotions/EligibleMembers';
import RecentPromotions from '../components/promotions/RecentPromotions';

const Promotions = () => {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <PromotionsHeader />
        <PromotionStats />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <EligibleMembers />
          </div>
          <div>
            <RecentPromotions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Promotions;