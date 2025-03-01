import React, { useState, useEffect } from 'react';
import { Key, Shield, LogOut } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { PasswordChangeForm } from './PasswordChangeForm';
import { useToast } from '../../contexts/ToastContext';
import { getActiveSessions, signOutFromAllSessions } from '../../lib/settings';

export function SecuritySettings() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await getActiveSessions();
      setSessions(data);
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const handleSignOutAll = async () => {
    try {
      setLoading(true);
      await signOutFromAllSessions();
      showToast('success', 'Signed out from all devices');
      await loadSessions();
    } catch (error) {
      showToast('error', 'Failed to sign out from all devices');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Key className="w-6 h-6 text-indigo-600" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Password</h3>
              <p className="text-sm text-gray-500">
                Update your password regularly to keep your account secure
              </p>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Change
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Shield className="w-6 h-6 text-indigo-600" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500">
                Add an extra layer of security to your account
              </p>
            </div>
            <button
              onClick={() => showToast('info', 'Two-factor authentication coming soon')}
              className="px-3 py-1.5 text-sm font-medium text-gray-400 cursor-not-allowed"
              disabled
            >
              Coming Soon
            </button>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900">Active Sessions</h3>
          <button
            onClick={handleSignOutAll}
            disabled={loading}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {loading ? 'Signing out...' : 'Sign out all devices'}
          </button>
        </div>

        {sessions.map((session, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4 mb-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Current Browser</p>
                <p className="text-sm text-gray-500">Last active just now</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                Active
              </span>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
      >
        <PasswordChangeForm onClose={() => setShowPasswordModal(false)} />
      </Modal>
    </div>
  );
}