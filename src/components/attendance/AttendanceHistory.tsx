import { useState } from 'react';
import { Calendar, ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAttendanceHistory } from '../../hooks/useAttendance';
import { AttendanceFilters } from '../../types/attendance';

const AttendanceHistory = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [filters] = useState<AttendanceFilters>({});
  const { history, loading, totalPages } = useAttendanceHistory(page, pageSize, filters);

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Attendance History</h2>
          <div className="flex items-center space-x-2">
            <button 
              className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
              aria-label="Filter by date"
            >
              <Calendar className="w-4 h-4 inline-block mr-2" />
              Filter by Date
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        {loading ? (
          <div className="py-8 text-center text-gray-500">
            Loading attendance history...
          </div>
        ) : history.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No attendance records found.
          </div>
        ) : (
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
              {history.map((record) => (
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
                    ) : record.trend === 'down' ? (
                      <ArrowDown className="w-5 h-5 text-red-500" />
                    ) : (
                      <span className="inline-block w-5 h-5 text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Pagination */}
      {!loading && history.length > 0 && (
        <div className="px-6 py-4 flex items-center justify-between border-t">
          <div className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className={`p-2 rounded-md ${
                page === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
              }`}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextPage}
              disabled={page >= totalPages}
              className={`p-2 rounded-md ${
                page >= totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
              }`}
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceHistory;