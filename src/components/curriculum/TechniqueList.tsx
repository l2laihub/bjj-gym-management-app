import React from 'react';
import { Play, CheckCircle2, BookOpen } from 'lucide-react';
import { getBeltColor } from '../../utils/beltUtils';

const techniques = [
  {
    id: 1,
    name: 'Armbar from Guard',
    category: 'Submissions',
    belt: 'white',
    status: 'mastered',
    videoUrl: '#',
    description: 'Basic armbar submission from closed guard position.',
  },
  {
    id: 2,
    name: 'Triangle Choke',
    category: 'Submissions',
    belt: 'white',
    status: 'learning',
    videoUrl: '#',
    description: 'Triangle choke submission from guard with proper angle and control.',
  },
  {
    id: 3,
    name: 'Scissor Sweep',
    category: 'Sweeps',
    belt: 'white',
    status: 'mastered',
    videoUrl: '#',
    description: 'Basic sweep from closed guard using leg positioning.',
  },
  {
    id: 4,
    name: 'De la Riva Guard',
    category: 'Guard',
    belt: 'blue',
    status: 'learning',
    videoUrl: '#',
    description: 'Open guard variation with foot on hip control.',
  },
];

const TechniqueList = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Techniques</h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {techniques.map((technique) => (
            <div key={technique.id} className="border rounded-lg p-4 hover:border-indigo-500 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{technique.name}</h3>
                  <p className="text-sm text-gray-500">{technique.description}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  technique.status === 'mastered' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {technique.status.charAt(0).toUpperCase() + technique.status.slice(1)}
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 ${getBeltColor(technique.belt)} rounded-full mr-2`} />
                    <span className="text-sm text-gray-500 capitalize">{technique.belt} Belt</span>
                  </div>
                  <span className="text-sm text-gray-500">{technique.category}</span>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-indigo-600">
                    <Play className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-indigo-600">
                    <BookOpen className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechniqueList;