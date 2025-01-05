import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { cn } from '../../utils/cn';
import { getBeltColor } from '../../utils/beltUtils';

interface MemberCategoriesProps {
  selectedCategory: 'all' | 'saplings' | 'kids' | 'adults';
  onCategoryChange: (category: 'all' | 'saplings' | 'kids' | 'adults') => void;
}

const categories = [
  { id: 'all', label: 'All Members' },
  { id: 'saplings', label: 'Saplings (3-5 yrs)' },
  { id: 'kids', label: 'Kids (6-15 yrs)' },
  { id: 'adults', label: 'Adults (16+ yrs)' },
] as const;

const members = {
  saplings: [
    { id: 1, name: 'Tommy Chen', age: 4, belt: 'white', stripes: 1, joinDate: '2024-01-15', guardian: 'Sarah Chen' },
    { id: 2, name: 'Emma Wilson', age: 5, belt: 'white', stripes: 2, joinDate: '2023-12-01', guardian: 'James Wilson' },
  ],
  kids: [
    { id: 3, name: 'Alex Thompson', age: 12, belt: 'yellow', stripes: 3, joinDate: '2023-06-15', guardian: 'Mary Thompson' },
    { id: 4, name: 'Sofia Rodriguez', age: 14, belt: 'green', stripes: 2, joinDate: '2023-03-20', guardian: 'Carlos Rodriguez' },
  ],
  adults: [
    { id: 5, name: 'John Silva', age: 28, belt: 'purple', stripes: 2, joinDate: '2022-01-10' },
    { id: 6, name: 'Maria Santos', age: 31, belt: 'blue', stripes: 4, joinDate: '2022-08-15' },
  ],
};

const MemberCategories = ({ selectedCategory, onCategoryChange }: MemberCategoriesProps) => {
  const getFilteredMembers = () => {
    if (selectedCategory === 'all') {
      return [...members.saplings, ...members.kids, ...members.adults];
    }
    return members[selectedCategory];
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                selectedCategory === category.id
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              {category.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Belt</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Join Date</th>
                {(selectedCategory === 'all' || selectedCategory === 'saplings' || selectedCategory === 'kids') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guardian</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getFilteredMembers().map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{member.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.age} years
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-6 h-6 ${getBeltColor(member.belt)} rounded-full mr-2`} />
                      <span className="text-sm text-gray-900 capitalize">{member.belt}</span>
                      <div className="ml-2 flex space-x-1">
                        {[...Array(member.stripes)].map((_, i) => (
                          <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full" />
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(member.joinDate).toLocaleDateString()}
                  </td>
                  {(selectedCategory === 'all' || selectedCategory === 'saplings' || selectedCategory === 'kids') && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {'guardian' in member ? member.guardian : '-'}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberCategories;