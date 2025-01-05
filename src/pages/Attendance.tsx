import React from 'react';
import AttendanceHeader from '../components/attendance/AttendanceHeader';
import ClassSchedule from '../components/attendance/ClassSchedule';
import AttendanceTracker from '../components/attendance/AttendanceTracker';
import AttendanceHistory from '../components/attendance/AttendanceHistory';

const Attendance = () => {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <AttendanceHeader />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <ClassSchedule />
          </div>
          <div>
            <AttendanceTracker />
          </div>
        </div>
        <AttendanceHistory />
      </div>
    </div>
  );
};

export default Attendance;