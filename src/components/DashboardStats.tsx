import React from 'react';
import { Users, ShoppingBag, TrendingUp, Award } from 'lucide-react';

const StatsCard = ({ icon, title, value, trend }: { icon: React.ReactNode; title: string; value: string; trend: string }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        <p className="text-green-500 text-sm mt-1">{trend}</p>
      </div>
      <div className="bg-indigo-50 p-3 rounded-lg">
        {icon}
      </div>
    </div>
  </div>
);

const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatsCard
        icon={<Users className="w-6 h-6 text-indigo-600" />}
        title="Active Members"
        value="156"
        trend="+12% this month"
      />
      <StatsCard
        icon={<ShoppingBag className="w-6 h-6 text-indigo-600" />}
        title="Equipment Value"
        value="$24,500"
        trend="+5% this month"
      />
      <StatsCard
        icon={<TrendingUp className="w-6 h-6 text-indigo-600" />}
        title="Monthly Revenue"
        value="$18,245"
        trend="+18% this month"
      />
      <StatsCard
        icon={<Award className="w-6 h-6 text-indigo-600" />}
        title="Upcoming Promotions"
        value="8"
        trend="Next week"
      />
    </div>
  );
};

export default DashboardStats;