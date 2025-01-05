import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const recentAttendees = [
  {
    id: 1,
    name: 'Alex Thompson',
    time: '06:05 AM',
    belt: 'purple',
  },
  {
    id: 2,
    name: 'Emma Wilson',
    time: '06:02 AM',
    belt: 'blue',
  },
  {
    id: 3,
    name: 'Michael Chen',
    time: '06:00 AM',
    belt: 'white',
  },
];

const getBeltColor = (belt: string) => {
  const colors = {
    white: 'bg-gray-100',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    brown: 'bg-amber-800',
    black: 'bg-black',
  };
  return colors[belt as keyof typeof colors] || 'bg-gray-100';
};

const AttendanceTracker = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Recent Check-ins</h2>
      
      <div className="space-y-4">
        {recentAttendees.map((attendee) => (
          <div key={attendee.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-3 h-3 ${getBeltColor(attendee.belt)} rounded-full mr-3`} />
              <div>
                <p className="font-medium">{attendee.name}</p>
                <p className="text-sm text-gray-500">{attendee.time}</p>
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t">
        <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Check-in Member
        </button>
      </div>
    </div>
  );
};

export default AttendanceTracker;