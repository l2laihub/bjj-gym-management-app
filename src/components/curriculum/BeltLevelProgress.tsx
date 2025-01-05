import React from 'react';
import { getBeltColor } from '../../utils/beltUtils';

const beltLevels = [
  { belt: 'white', progress: 100, techniques: 25, total: 25 },
  { belt: 'blue', progress: 75, techniques: 30, total: 40 },
  { belt: 'purple', progress: 45, techniques: 27, total: 60 },
  { belt: 'brown', progress: 20, techniques: 16, total: 80 },
  { belt: 'black', progress: 5, techniques: 5, total: 100 },
];

const BeltLevelProgress = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      {beltLevels.map((level) => (
        <div key={level.belt} className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center mb-3">
            <div className={`w-6 h-6 ${getBeltColor(level.belt)} rounded-full mr-2`} />
            <span className="font-medium capitalize">{level.belt} Belt</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div
              className="bg-indigo-600 h-2 rounded-full"
              style={{ width: `${level.progress}%` }}
            />
          </div>
          <div className="text-sm text-gray-500">
            {level.techniques}/{level.total} techniques
          </div>
        </div>
      ))}
    </div>
  );
};

export default BeltLevelProgress;