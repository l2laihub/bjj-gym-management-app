import React, { useState } from 'react';
import { Calendar, Phone, Mail, CheckCircle, Plus, AlertTriangle } from 'lucide-react';
import { useFollowUpTasks } from '../../hooks/useFollowUpTasks';
import { useProspects } from '../../hooks/useProspects';
import { useToast } from '../../contexts/ToastContext';
import { Modal } from '../ui/Modal';
import type { CreateFollowUpTaskData } from '../../types/prospect';

export function FollowUpTasks() {
  const { tasks, loading: tasksLoading, completeTask, addTask, refetch } = useFollowUpTasks();
  const { prospects, loading: prospectsLoading } = useProspects();
  const { showToast } = useToast();
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTask, setNewTask] = useState<Partial<CreateFollowUpTaskData>>({
    type: 'call',
    priority: 'medium',
    due_date: new Date().toISOString().split('T')[0],
  });

  const handleCompleteTask = async (id: string) => {
    try {
      await completeTask(id);
      // Explicitly refetch tasks to update the list immediately
      await refetch();
      showToast('success', 'Task marked as completed');
    } catch (error) {
      showToast('error', 'Failed to complete task');
    }
  };

  const handleAddTask = async () => {
    if (!newTask.prospect_id || !newTask.notes) {
      showToast('error', 'Please fill in all required fields');
      return;
    }

    try {
      await addTask(newTask as CreateFollowUpTaskData);
      // Explicitly refetch tasks to update the list immediately
      await refetch();
      showToast('success', 'Follow-up task added successfully');
      setShowAddTaskModal(false);
      setNewTask({
        type: 'call',
        priority: 'medium',
        due_date: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      showToast('error', 'Failed to add follow-up task');
    }
  };

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
    return colors[priority as keyof typeof colors] || 'border-gray-200 bg-gray-50';
  };

  if (tasksLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Follow-up Tasks</h2>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 rounded-lg border border-gray-200 bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div className="space-y-2 w-full">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Follow-up Tasks</h2>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
            {tasks.length} pending
          </span>
        </div>
        
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No pending follow-up tasks</p>
            <button 
              onClick={() => setShowAddTaskModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 inline-flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Task
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-lg border ${getPriorityColor(task.priority)}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center">
                      {getTaskIcon(task.type)}
                      <h3 className="font-medium text-gray-900 ml-2">
                        {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{task.notes}</p>
                  </div>
                  <button 
                    onClick={() => handleCompleteTask(task.id)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <Calendar className="w-4 h-4 mr-1" />
                  Due: {new Date(task.due_date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-6 pt-6 border-t">
          <button 
            onClick={() => setShowAddTaskModal(true)}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Follow-up Task
          </button>
        </div>
      </div>

      <Modal
        isOpen={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        title="Add Follow-up Task"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="prospect_id" className="block text-sm font-medium text-gray-700">
              Prospect
            </label>
            <select
              id="prospect_id"
              name="prospect_id"
              value={newTask.prospect_id || ''}
              onChange={(e) => setNewTask({ ...newTask, prospect_id: e.target.value })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
              required
            >
              <option value="">Select a prospect</option>
              {prospectsLoading ? (
                <option value="" disabled>Loading prospects...</option>
              ) : prospects.length > 0 ? (
                prospects.map(prospect => (
                  <option key={prospect.id} value={prospect.id}>
                    {prospect.full_name}
                  </option>
                ))
              ) : (
                <option value="" disabled>No prospects available</option>
              )}
            </select>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Task Type
            </label>
            <select
              id="type"
              name="type"
              value={newTask.type || 'call'}
              onChange={(e) => setNewTask({ ...newTask, type: e.target.value as any })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
            >
              <option value="call">Call</option>
              <option value="email">Email</option>
              <option value="meeting">Meeting</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={newTask.priority || 'medium'}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              type="date"
              id="due_date"
              name="due_date"
              value={newTask.due_date || ''}
              onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
              required
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={newTask.notes || ''}
              onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
              rows={3}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
              required
            />
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowAddTaskModal(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddTask}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Add Task
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}