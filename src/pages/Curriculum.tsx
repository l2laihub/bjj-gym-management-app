import React from 'react';
import CurriculumHeader from '../components/curriculum/CurriculumHeader';
import BeltLevelProgress from '../components/curriculum/BeltLevelProgress';
import TechniqueList from '../components/curriculum/TechniqueList';
import RequirementsSummary from '../components/curriculum/RequirementsSummary';

const Curriculum = () => {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <CurriculumHeader />
        <BeltLevelProgress />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <TechniqueList />
          </div>
          <div>
            <RequirementsSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Curriculum;