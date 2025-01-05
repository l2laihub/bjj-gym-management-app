import React from 'react';
import { Calendar, Users, Clock } from 'lucide-react';

const scheduleData = {
  'Saplings Gi Classes': {
    days: ['Monday', 'Friday'],
    time: '4:30 PM - 5:10 PM',
    ageGroup: '3-5 yrs',
    type: 'gi'
  },
  'Kids Gi Classes': {
    days: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    time: '5:30 PM - 6:15 PM',
    ageGroup: 'Kids',
    type: 'gi'
  },
  'Kids No Gi & Wrestling': {
    days: ['Wednesday'],
    time: '5:30 PM - 6:15 PM',
    ageGroup: 'Kids',
    type: 'nogi',
    note: 'Seasonal Program – Please inquire for details.'
  },
  'Adults Gi Classes': {
    days: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    time: '6:30 PM - 7:30 PM',
    ageGroup: 'Adults',
    type: 'gi'
  },
  'Adults No Gi': {
    days: ['Wednesday'],
    time: '6:30 PM - 7:30 PM',
    ageGroup: 'Adults',
    type: 'nogi'
  },
  'Adults Open Mat': {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    time: '7:30 PM - 8:00 PM',
    ageGroup: 'Adults',
    type: 'open'
  },
  'Saturday Open Mat': {
    days: ['Saturday'],
    time: '10:30 AM - 12:00 PM',
    ageGroup: 'Adults',
    type: 'open'
  }
};

const getClassTypeStyles = (type: string) => {
  const styles = {
    gi: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    nogi: 'bg-purple-100 text-purple-800 border-purple-200',
    open: 'bg-green-100 text-green-800 border-green-200',
  };
  return styles[type as keyof typeof styles] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const Schedule = () => {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Class Schedule</h1>
          <p className="text-gray-500">HEVA BJJ weekly class schedule</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <Calendar className="w-6 h-6 text-indigo-600 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Weekly Classes</p>
                <p className="text-2xl font-bold">24</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <Users className="w-6 h-6 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Average Class Size</p>
                <p className="text-2xl font-bold">15</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <Clock className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Training Hours/Week</p>
                <p className="text-2xl font-bold">25.5</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Weekly Schedule</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {Object.entries(scheduleData).map(([className, details]) => (
                <div key={className} className={`border rounded-lg p-4 ${getClassTypeStyles(details.type)}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{className}</h3>
                      <p className="text-sm mt-1">{details.time}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {details.days.map((day) => (
                          <span key={day} className="px-2 py-1 bg-white bg-opacity-50 rounded-full text-xs font-medium">
                            {day}
                          </span>
                        ))}
                      </div>
                      {details.note && (
                        <p className="text-sm mt-2 italic">{details.note}</p>
                      )}
                    </div>
                    <span className="px-3 py-1 bg-white bg-opacity-50 rounded-full text-xs font-medium">
                      {details.ageGroup}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-4 flex-wrap">
          <div className="px-4 py-2 rounded-lg bg-indigo-100 text-indigo-800 text-sm font-medium">
            Gi Classes
          </div>
          <div className="px-4 py-2 rounded-lg bg-purple-100 text-purple-800 text-sm font-medium">
            No Gi Classes
          </div>
          <div className="px-4 py-2 rounded-lg bg-green-100 text-green-800 text-sm font-medium">
            Open Mat
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;