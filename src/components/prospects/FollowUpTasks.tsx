import React from 'react';
import { Calendar, Phone, Mail, CheckCircle } from 'lucide-react';

const followUps = [
  {
    id: 1,
    prospect: 'Michael Chen',
    type: 'call',
    dueDate: '2024-03-15',
    notes: 'Discuss trial experience and membership options',
    priority: 'high',
  },
  {
    id: 2,
    prospect: 'Sarah Johnson',
    type: 'email',
    dueDate: '2024-03-16',
    notes: 'Send class schedule and pricing information',
    priority: 'medium',
  },
  {
    id: 3,
    prospect: 'David Kim',
    type: 'call',
    dueDate: '2024-03-14',
    notes: 'Confirm trial class schedule',
    priority: 'high',
  },
];

const getTaskIcon = (type: string) => {
  switch (type) {
    case 'call':
      return <Phone className="w-4 h-4 text-indigo-600" />;
    case 'email':
      return <Mail className="w-4 h-4 text-blue-600" />;
    default:
      return <Calendar className="w-4 h-4 text-gray-600" />;
  }
};

const getPriorityColor = (priority: string) => {
  const colors = {
    high: 'border-red-200 bg-red-50',
    medium: 'border-yellow-200 bg-yellow-50',
    low: 'border-green-200 bg-green-50',
  };
  return colors[priority] || 'border-gray-200 bg-gray-50';
};

const FollowUpTasks = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Follow-up Tasks</h2>
        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
          {followUps.length} pending
        </span>
      </div>
      
      <div className="space-y-4">
        {followUps.map((task) => (
          <div
            key={task.id}
            className={`p-4 rounded-lg border ${getPriorityColor(task.priority)}`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center">
                  {getTaskIcon(task.type)}
                  <h3 className="font-medium text-gray-900 ml-2">{task.prospect}</h3>
                </div>
                <p className="text-sm text-gray-500 mt-1">{task.notes}</p>
              </div>
              <button className="text-indigo-600 hover:text-indigo-800">
                <CheckCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center text-sm text-gray-500 mt-2">
              <Calendar className="w-4 h-4 mr-1" />
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t">
        <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Add Follow-up Task
        </button>
      </div>
    </div>
  );
};

export default FollowUpTasks;