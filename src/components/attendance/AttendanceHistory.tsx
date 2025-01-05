import React from 'react';
import { Calendar, ArrowDown, ArrowUp } from 'lucide-react';

const attendanceHistory = [
  {
    id: 1,
    date: '2024-03-12',
    className: 'Fundamentals',
    instructor: 'John Silva',
    attendees: 15,
    trend: 'up',
  },
  {
    id: 2,
    date: '2024-03-11',
    className: 'Advanced',
    instructor: 'Maria Santos',
    attendees: 12,
    trend: 'down',
  },
  {
    id: 3,
    date: '2024-03-10',
    className: 'No-Gi',
    instructor: 'Carlos Rodriguez',
    attendees: 18,
    trend: 'up',
  },
];

const AttendanceHistory = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Attendance History</h2>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">
              <Calendar className="w-4 h-4 inline-block mr-2" />
              Filter by Date
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Instructor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Attendees
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Trend
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attendanceHistory.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.className}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.instructor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.attendees}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {record.trend === 'up' ? (
                    <ArrowUp className="w-5 h-5 text-green-500" />
                  ) : (
                    <ArrowDown className="w-5 h-5 text-red-500" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceHistory;