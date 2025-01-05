import React from 'react';
import DashboardStats from '../components/DashboardStats';
import MembershipChart from '../components/MembershipChart';
import RecentActivity from '../components/RecentActivity';
import InventoryStatus from '../components/InventoryStatus';
import PageContainer from '../components/layout/PageContainer';
import PageHeader from '../components/layout/PageHeader';

const Dashboard = () => {
  return (
    <PageContainer>
      <PageHeader 
        title="Dashboard"
        description="Welcome to HEVA BJJ Management System"
      />
      
      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MembershipChart />
        <RecentActivity />
      </div>
      
      <InventoryStatus />
    </PageContainer>
  );
};

export default Dashboard;