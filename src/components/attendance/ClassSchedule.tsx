import { useState } from 'react';
import { Clock, Users } from 'lucide-react';
import { useClassSchedule } from '../../hooks/useAttendance';

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
  const [selectedDay, setSelectedDay] = useState(today);
  const { schedule, loading } = useClassSchedule(selectedDay);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Today's Schedule</h2>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          <select 
            value={selectedDay} 
            onChange={(e) => setSelectedDay(e.target.value)}
            className="border-none bg-transparent focus:ring-0 text-gray-500 cursor-pointer"
            aria-label="Select day of week"
          >
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="py-8 text-center text-gray-500">
          Loading schedule...
        </div>
      ) : schedule.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          No classes scheduled for {selectedDay}.
        </div>
      ) : (
        <div className="space-y-4">
          {schedule.map((cls) => (
            <div
              key={cls.id}
              className="border rounded-lg p-4 hover:border-indigo-500 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{cls.className}</h3>
                  <p className="text-gray-500">{cls.startTime.substring(0, 5)} - {cls.endTime.substring(0, 5)}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getClassTypeStyles(cls.classType)}`}>
                  {cls.ageGroup}
                </span>
              </div>
              
              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-1" />
                  <span>Capacity: {cls.capacity}</span>
                </div>
                <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  Take Attendance
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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