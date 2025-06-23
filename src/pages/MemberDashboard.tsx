import { Calendar, Clock, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useClassSchedule, useRecentCheckIns } from '../hooks/useAttendance';

const MemberDashboard = () => {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const { schedule, loading: scheduleLoading } = useClassSchedule(today);
  const { checkIns, loading: checkInsLoading } = useRecentCheckIns(3);

  // Format time from "HH:MM:SS" to "HH:MM AM/PM"
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back{user ? `, ${user.email?.split('@')[0]}` : ''}!</h1>
          <p className="text-gray-600 mt-1">Here's your BJJ training overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <a 
                href="/member/check-in" 
                className="flex items-center justify-between p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-indigo-700 transition-colors"
              >
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-3" />
                  <span className="font-medium">Check In to Class</span>
                </div>
                <span className="text-xs bg-indigo-200 text-indigo-800 px-2 py-1 rounded-full">
                  Quick
                </span>
              </a>
              
              <a 
                href="/schedule" 
                className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
              >
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-3" />
                  <span className="font-medium">View Schedule</span>
                </div>
              </a>
              
              <a 
                href="/curriculum" 
                className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
              >
                <div className="flex items-center">
                  <Award className="w-5 h-5 mr-3" />
                  <span className="font-medium">Track Progress</span>
                </div>
              </a>
            </div>
          </div>

          {/* Today's Classes Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Today's Classes</h2>
            {scheduleLoading ? (
              <div className="py-8 text-center text-gray-500">
                Loading today's classes...
              </div>
            ) : schedule.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                No classes scheduled for today.
              </div>
            ) : (
              <div className="space-y-3">
                {schedule.map((cls) => (
                  <div
                    key={cls.id}
                    className="border rounded-lg p-4 hover:border-indigo-500 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{cls.className}</h3>
                        <p className="text-gray-500">
                          {formatTime(cls.startTime)} - {formatTime(cls.endTime)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 mb-2">
                          {cls.classType.toUpperCase()}
                        </span>
                        <a 
                          href={`/member/check-in?classId=${cls.id}`}
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        >
                          Check In
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Your Recent Activity</h2>
          {checkInsLoading ? (
            <div className="py-8 text-center text-gray-500">
              Loading your recent activity...
            </div>
          ) : checkIns.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No recent activity found. Start training to see your progress!
            </div>
          ) : (
            <div className="space-y-4">
              {checkIns.map((checkIn) => (
                <div
                  key={checkIn.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="mr-4 p-2 bg-indigo-100 rounded-full">
                      <Clock className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium">Attended Class</p>
                      <p className="text-sm text-gray-500">
                        {new Date(checkIn.checkInTime).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(checkIn.checkInTime).toLocaleTimeString([], {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </span>
                </div>
              ))}
              <div className="text-center mt-4">
                <a 
                  href="/attendance" 
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  View All Activity
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
