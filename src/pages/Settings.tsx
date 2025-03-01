import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Settings as SettingsIcon, User, Mail, Shield, Bell } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import PageHeader from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { PersonalInfoForm } from '../components/settings/PersonalInfoForm';
import { SecuritySettings } from '../components/settings/SecuritySettings';
import { NotificationSettings } from '../components/settings/NotificationSettings';

const Settings = () => {
  const { user } = useAuth();

  return (
    <PageContainer>
      <PageHeader 
        title="Settings"
        description="Manage your account settings and preferences"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <div className="p-4">
              <nav className="space-y-1">
                <a 
                  href="#personal-info" 
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-indigo-50 text-indigo-700"
                >
                  <User className="w-5 h-5 mr-3" />
                  Personal Info
                </a>
                <a 
                  href="#security" 
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <Shield className="w-5 h-5 mr-3" />
                  Security
                </a>
                <a 
                  href="#notifications" 
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <Bell className="w-5 h-5 mr-3" />
                  Notifications
                </a>
              </nav>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Personal Info Section */}
          <section id="personal-info">
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Personal Information</h2>
                <PersonalInfoForm />
              </div>
            </Card>
          </section>

          {/* Security Section */}
          <section id="security">
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Security Settings</h2>
                <SecuritySettings />
              </div>
            </Card>
          </section>

          {/* Notifications Section */}
          <section id="notifications">
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Notification Preferences</h2>
                <NotificationSettings />
              </div>
            </Card>
          </section>
        </div>
      </div>
    </PageContainer>
  );
};

export default Settings;