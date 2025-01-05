import React from 'react';
import ProspectsHeader from '../components/prospects/ProspectsHeader';
import ProspectStats from '../components/prospects/ProspectStats';
import ProspectsList from '../components/prospects/ProspectsList';
import FollowUpTasks from '../components/prospects/FollowUpTasks';

const Prospects = () => {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <ProspectsHeader />
        <ProspectStats />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <ProspectsList />
          </div>
          <div>
            <FollowUpTasks />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prospects;