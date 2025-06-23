import { useState } from 'react';
import { Clock, User } from 'lucide-react';
import { useRecentCheckIns } from '../../hooks/useAttendance';

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

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
  const [limit] = useState(5);
  const { checkIns, loading } = useRecentCheckIns(limit);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Recent Check-ins</h2>
        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
          View All
        </button>
      </div>
      
      {loading ? (
        <div className="py-8 text-center text-gray-500">
          Loading recent check-ins...
        </div>
      ) : checkIns.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          No recent check-ins found.
        </div>
      ) : (
        <div className="space-y-4">
          {checkIns.map((checkIn) => (
            <div
              key={checkIn.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:border-indigo-500 transition-colors"
            >
              <div className="flex items-center">
                <div className={`w-10 h-10 ${getBeltColor(checkIn.belt)} rounded-full flex items-center justify-center mr-4`}>
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium">{checkIn.memberName}</p>
                  <p className="text-sm text-gray-500">
                    {checkIn.belt.charAt(0).toUpperCase() + checkIn.belt.slice(1)} Belt
                    {checkIn.stripes ? ` • ${checkIn.stripes} Stripes` : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-sm">{formatTime(checkIn.checkInTime)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttendanceTracker;