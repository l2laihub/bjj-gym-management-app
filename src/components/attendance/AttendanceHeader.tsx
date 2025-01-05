import React from 'react';
import { Calendar, Users, Clock } from 'lucide-react';

const stats = [
  {
    id: 1,
    title: "Today's Classes",
    value: '6',
    icon: <Calendar className="w-6 h-6 text-indigo-600" />,
  },
  {
    id: 2,
    title: "Today's Attendance",
    value: '42',
    icon: <Users className="w-6 h-6 text-green-600" />,
  },
  {
    id: 3,
    title: 'Average Class Size',
    value: '15',
    icon: <Clock className="w-6 h-6 text-blue-600" />,
  },
];

const AttendanceHeader = () => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-500">Track and manage class attendance</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Export Data
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Take Attendance
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceHeader;