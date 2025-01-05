import React from 'react';
import { Award, Clock, BookOpen } from 'lucide-react';
import { getBeltColor } from '../../utils/beltUtils';

const requirements = [
  {
    id: 1,
    belt: 'white',
    minTime: '12-18 months',
    techniques: 25,
    requirements: [
      'Basic positions and movements',
      'Fundamental submissions',
      'Basic escapes',
      'Self-defense techniques',
    ],
  },
  {
    id: 2,
    belt: 'blue',
    minTime: '2-3 years',
    techniques: 40,
    requirements: [
      'Advanced guard techniques',
      'Submission combinations',
      'Counter-attacks',
      'Competition experience',
    ],
  },
];

const RequirementsSummary = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Belt Requirements</h2>
      
      <div className="space-y-6">
        {requirements.map((req) => (
          <div key={req.id} className="border-b pb-6 last:border-0 last:pb-0">
            <div className="flex items-center mb-4">
              <div className={`w-6 h-6 ${getBeltColor(req.belt)} rounded-full mr-2`} />
              <span className="font-medium capitalize">{req.belt} Belt</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-2" />
                Minimum Time: {req.minTime}
              </div>
              
              <div className="flex items-center text-sm text-gray-500">
                <BookOpen className="w-4 h-4 mr-2" />
                Required Techniques: {req.techniques}
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Key Requirements:</h4>
                <ul className="space-y-2">
                  {req.requirements.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Award className="w-4 h-4 text-indigo-600 mr-2 mt-0.5" />
                      <span className="text-sm text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t">
        <button className="w-full px-4 py-2 text-indigo-600 hover:text-indigo-900 font-medium">
          View Full Requirements
        </button>
      </div>
    </div>
  );
};

export default RequirementsSummary;