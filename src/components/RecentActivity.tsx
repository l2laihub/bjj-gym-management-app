import React from 'react';

const activities = [
  {
    id: 1,
    member: 'John Silva',
    action: 'Attended Advanced Class',
    time: '2 hours ago',
  },
  {
    id: 2,
    member: 'Maria Santos',
    action: 'Purchased New Gi',
    time: '4 hours ago',
  },
  {
    id: 3,
    member: 'Carlos Rodriguez',
    action: 'Promoted to Purple Belt',
    time: '1 day ago',
  },
  {
    id: 4,
    member: 'Sarah Lee',
    action: 'Renewed Membership',
    time: '1 day ago',
  },
];

const RecentActivity = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center justify-between border-b pb-4 last:border-0">
            <div>
              <p className="font-medium text-gray-900">{activity.member}</p>
              <p className="text-gray-500 text-sm">{activity.action}</p>
            </div>
            <span className="text-gray-400 text-sm">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;