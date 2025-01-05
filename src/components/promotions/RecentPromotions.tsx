import React from 'react';
import { Award } from 'lucide-react';

const recentPromotions = [
  {
    id: 1,
    name: 'John Silva',
    promotion: 'Blue to Purple',
    date: '2024-03-10',
    instructor: 'Master Chen',
  },
  {
    id: 2,
    name: 'Maria Santos',
    promotion: 'White to Blue',
    date: '2024-03-08',
    instructor: 'Professor Lee',
  },
  {
    id: 3,
    name: 'Carlos Rodriguez',
    promotion: '3rd to 4th Stripe',
    date: '2024-03-05',
    instructor: 'Master Chen',
  },
  {
    id: 4,
    name: 'Emma Wilson',
    promotion: 'Purple to Brown',
    date: '2024-03-01',
    instructor: 'Professor Lee',
  },
];

const RecentPromotions = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Recent Promotions</h2>
      <div className="space-y-6">
        {recentPromotions.map((promotion) => (
          <div key={promotion.id} className="flex items-start space-x-4">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Award className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">{promotion.name}</p>
              <p className="text-sm text-gray-500">{promotion.promotion}</p>
              <div className="flex items-center mt-1 text-xs text-gray-500">
                <span>{new Date(promotion.date).toLocaleDateString()}</span>
                <span className="mx-1">•</span>
                <span>{promotion.instructor}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t">
        <button className="w-full px-4 py-2 text-sm text-indigo-600 hover:text-indigo-900 font-medium">
          View All Promotions
        </button>
      </div>
    </div>
  );
};

export default RecentPromotions;