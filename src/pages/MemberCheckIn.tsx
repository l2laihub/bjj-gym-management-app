import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useClassSchedule, useCheckIn } from '../hooks/useAttendance';
import { ClassScheduleItem } from '../types/attendance';

const MemberCheckIn = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const classIdParam = queryParams.get('classId');
  
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const { schedule, loading: scheduleLoading } = useClassSchedule(today);
  const { checkIn, loading: checkInLoading } = useCheckIn();
  
  const [selectedClass, setSelectedClass] = useState<ClassScheduleItem | null>(null);
  const [checkInSuccess, setCheckInSuccess] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  // Format time from "HH:MM:SS" to "HH:MM AM/PM"
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Find selected class from URL param
  useEffect(() => {
    if (classIdParam && schedule.length > 0) {
      const foundClass = schedule.find(cls => cls.id === classIdParam);
      if (foundClass) {
        setSelectedClass(foundClass);
      }
    }
  }, [classIdParam, schedule]);

  // Handle class selection
  const handleSelectClass = (cls: ClassScheduleItem) => {
    setSelectedClass(cls);
    setCheckInSuccess(false);
    setError(undefined);
  };

  // Handle check-in
  const handleCheckIn = async () => {
    if (!selectedClass || !user) return;

    try {
      setError(undefined);
      
      // Execute the check-in operation
      await checkIn({
        profileId: user.id,
        classType: selectedClass.classType,
        instructorId: selectedClass.instructorId || undefined,
        notes: `Checked in via member portal - ${selectedClass.className}`
      });

      // If we get here, the check-in was successful
      setCheckInSuccess(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setSelectedClass(null);
        setCheckInSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Check-in error:', err);
      
      // Extract the error message
      let errorMessage = 'An error occurred during check-in. Please try again.';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        errorMessage = String((err as { message: unknown }).message);
      }
      
      // Check for specific error messages
      if (errorMessage.includes('Permission denied')) {
        errorMessage = 'You do not have permission to check in. Please contact an administrator.';
      } else if (errorMessage.includes('row-level security policy')) {
        errorMessage = 'Access denied due to security policy. Please contact an administrator.';
      }
      
      setError(errorMessage);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <button 
            onClick={() => navigate('/member/dashboard')}
            className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Class Check-In</h1>
          <p className="text-gray-600 mt-1">Check in to your scheduled BJJ classes</p>
        </div>

        {checkInSuccess ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-semibold text-green-800 mb-2">Check-In Successful!</h2>
            <p className="text-green-700 mb-6">
              You've been checked in to {selectedClass?.className}.
            </p>
            <button
              onClick={() => {
                setSelectedClass(null);
                setCheckInSuccess(false);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Check In to Another Class
            </button>
          </div>
        ) : (
          <>
            {/* Step 1: Select a class */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {selectedClass ? 'Selected Class' : 'Step 1: Select a Class'}
              </h2>
              
              {scheduleLoading ? (
                <div className="py-8 text-center text-gray-500">
                  Loading today's classes...
                </div>
              ) : schedule.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  No classes scheduled for today.
                </div>
              ) : selectedClass ? (
                <div className="border-2 border-indigo-500 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{selectedClass.className}</h3>
                      <p className="text-gray-500">
                        {formatTime(selectedClass.startTime)} - {formatTime(selectedClass.endTime)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Instructor: {selectedClass.instructorName || 'TBD'}
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
                      {selectedClass.classType.toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedClass(null)}
                    className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    Change Class
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {schedule.map((cls) => (
                    <div
                      key={cls.id}
                      className="border rounded-lg p-4 hover:border-indigo-500 transition-colors cursor-pointer"
                      onClick={() => handleSelectClass(cls)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{cls.className}</h3>
                          <p className="text-gray-500">
                            {formatTime(cls.startTime)} - {formatTime(cls.endTime)}
                          </p>
                        </div>
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
                          {cls.classType.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Step 2: Confirm check-in */}
            {selectedClass && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Step 2: Confirm Check-In</h2>
                <p className="text-gray-600 mb-6">
                  You're about to check in to <strong>{selectedClass.className}</strong> at{' '}
                  <strong>{formatTime(selectedClass.startTime)}</strong>. Please confirm to complete your check-in.
                </p>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}
                
                <div className="flex justify-end">
                  <button
                    onClick={handleCheckIn}
                    disabled={checkInLoading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300"
                  >
                    {checkInLoading ? 'Processing...' : 'Confirm Check-In'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MemberCheckIn;
