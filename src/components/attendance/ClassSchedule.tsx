import React from 'react';
import { Clock, Users } from 'lucide-react';

const scheduleData = {
  'Monday': [
    { id: 1, name: 'Saplings Gi Class', time: '4:30 PM - 5:10 PM', ageGroup: '3-5 yrs', type: 'gi' },
    { id: 2, name: 'Kids Gi Class', time: '5:30 PM - 6:15 PM', ageGroup: 'Kids', type: 'gi' },
    { id: 3, name: 'Adults Gi Class', time: '6:30 PM - 7:30 PM', ageGroup: 'Adults', type: 'gi' },
    { id: 4, name: 'Open Mat', time: '7:30 PM - 8:00 PM', ageGroup: 'Adults', type: 'open' },
  ],
  'Tuesday': [
    { id: 5, name: 'Kids Gi Class', time: '5:30 PM - 6:15 PM', ageGroup: 'Kids', type: 'gi' },
    { id: 6, name: 'Adults Gi Class', time: '6:30 PM - 7:30 PM', ageGroup: 'Adults', type: 'gi' },
    { id: 7, name: 'Open Mat', time: '7:30 PM - 8:00 PM', ageGroup: 'Adults', type: 'open' },
  ],
  'Wednesday': [
    { id: 8, name: 'Kids No Gi & Wrestling', time: '5:30 PM - 6:15 PM', ageGroup: 'Kids', type: 'nogi' },
    { id: 9, name: 'Adults No Gi', time: '6:30 PM - 7:30 PM', ageGroup: 'Adults', type: 'nogi' },
    { id: 10, name: 'Open Mat', time: '7:30 PM - 8:00 PM', ageGroup: 'Adults', type: 'open' },
  ],
  'Thursday': [
    { id: 11, name: 'Kids Gi Class', time: '5:30 PM - 6:15 PM', ageGroup: 'Kids', type: 'gi' },
    { id: 12, name: 'Adults Gi Class', time: '6:30 PM - 7:30 PM', ageGroup: 'Adults', type: 'gi' },
    { id: 13, name: 'Open Mat', time: '7:30 PM - 8:00 PM', ageGroup: 'Adults', type: 'open' },
  ],
  'Friday': [
    { id: 14, name: 'Saplings Gi Class', time: '4:30 PM - 5:10 PM', ageGroup: '3-5 yrs', type: 'gi' },
    { id: 15, name: 'Kids Gi Class', time: '5:30 PM - 6:15 PM', ageGroup: 'Kids', type: 'gi' },
    { id: 16, name: 'Adults Gi Class', time: '6:30 PM - 7:30 PM', ageGroup: 'Adults', type: 'gi' },
    { id: 17, name: 'Open Mat', time: '7:30 PM - 8:00 PM', ageGroup: 'Adults', type: 'open' },
  ],
  'Saturday': [
    { id: 18, name: 'Open Mat', time: '10:30 AM - 12:00 PM', ageGroup: 'Adults', type: 'open' },
  ],
};

const getClassTypeStyles = (type: string) => {
  const styles = {
    gi: 'bg-indigo-100 text-indigo-800',
    nogi: 'bg-purple-100 text-purple-800',
    open: 'bg-green-100 text-green-800',
  };
  return styles[type as keyof typeof styles] || 'bg-gray-100 text-gray-800';
};

const ClassSchedule = () => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todaySchedule = scheduleData[today as keyof typeof scheduleData] || [];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Today's Schedule</h2>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          {today}
        </div>
      </div>
      
      <div className="space-y-4">
        {todaySchedule.map((cls) => (
          <div
            key={cls.id}
            className="border rounded-lg p-4 hover:border-indigo-500 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{cls.name}</h3>
                <p className="text-gray-500">{cls.time}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getClassTypeStyles(cls.type)}`}>
                {cls.ageGroup}
              </span>
            </div>
            
            <div className="flex justify-between items-center mt-3">
              <div className="flex items-center text-sm text-gray-500">
                <Users className="w-4 h-4 mr-1" />
                <span>Capacity: 20</span>
              </div>
              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                Take Attendance
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Class Types</h3>
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            Gi Classes
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            No Gi Classes
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Open Mat
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          * Kids No Gi & Wrestling is a seasonal program – Please inquire for details.
        </p>
      </div>
    </div>
  );
};

export default ClassSchedule;