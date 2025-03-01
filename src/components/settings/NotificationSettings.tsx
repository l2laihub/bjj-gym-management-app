import React, { useEffect, useState } from 'react';
import { Bell, Calendar, Trophy, Award } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { getNotificationPreferences, updateNotificationPreferences, type NotificationPreferences } from '../../lib/notifications';

const notificationTypes = [
  {
    id: 'class_reminders',
    title: 'Class Reminders',
    description: 'Get notified about upcoming classes and schedule changes',
    icon: Calendar,
  },
  {
    id: 'promotions',
    title: 'Belt Promotions',
    description: 'Notifications about belt promotions and stripe updates',
    icon: Award,
  },
  {
    id: 'tournaments',
    title: 'Tournament Updates',
    description: 'Stay informed about upcoming tournaments and results',
    icon: Trophy,
  },
  {
    id: 'announcements',
    title: 'General Announcements',
    description: 'Important gym announcements and news',
    icon: Bell,
  },
] as const;

export function NotificationSettings() {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const data = await getNotificationPreferences();
      setPreferences(data);
    } catch (error) {
      console.error('Error loading preferences:', error);
      showToast('error', 'Failed to load notification preferences');
    }
  };

  const handleToggle = async (key: keyof NotificationPreferences) => {
    if (!preferences) return;

    try {
      setLoading(true);
      const newPreferences = {
        ...preferences,
        [key]: !preferences[key],
      };
      
      await updateNotificationPreferences({ [key]: !preferences[key] });
      setPreferences(newPreferences);
      showToast('success', 'Preferences updated successfully');
    } catch (error) {
      showToast('error', 'Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  if (!preferences) {
    return (
      <div className="animate-pulse space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gray-200 rounded-lg" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {notificationTypes.map((type) => (
        <div key={type.id} className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <type.icon className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">{type.title}</h3>
                <p className="text-sm text-gray-500">
                  {type.description}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={preferences[type.id]}
                  onChange={() => handleToggle(type.id)}
                  disabled={loading}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>
      ))}

      <div className="pt-6 border-t">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Notification Methods</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive notifications via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={preferences.email_enabled}
                onChange={() => handleToggle('email_enabled')}
                disabled={loading}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Push Notifications</p>
              <p className="text-sm text-gray-500">Receive notifications on your device</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={preferences.push_enabled}
                onChange={() => handleToggle('push_enabled')}
                disabled={loading}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}