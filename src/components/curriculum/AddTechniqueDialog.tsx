import React, { useState } from 'react';
import { X } from 'lucide-react';
import { BeltRank } from '../../utils/beltUtils';
import { Technique } from '../../data/mockData';
import { useCurriculumStore } from '../../store/curriculumStore';

interface AddTechniqueDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type TechniqueFormData = Omit<Technique, 'id' | 'status'>;

const initialFormData: TechniqueFormData = {
  name: '',
  description: '',
  category: 'Guard',
  beltLevel: 'white',
  videoUrl: '',
};

export const AddTechniqueDialog: React.FC<AddTechniqueDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState<TechniqueFormData>(initialFormData);
  const addTechnique = useCurriculumStore(state => state.addTechnique);
  const isLoading = useCurriculumStore(state => state.isLoading);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addTechnique({
      ...formData,
      status: 'not_started',
    });
    onClose();
    setFormData(initialFormData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Add New Technique</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Technique Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Armbar from Guard"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
              placeholder="Describe the technique..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Technique['category'] })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Guard">Guard</option>
                <option value="Mount">Mount</option>
                <option value="Side Control">Side Control</option>
                <option value="Back Control">Back Control</option>
                <option value="Takedowns">Takedowns</option>
                <option value="Submissions">Submissions</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Belt Level
              </label>
              <select
                required
                value={formData.beltLevel}
                onChange={(e) => setFormData({ ...formData, beltLevel: e.target.value as BeltRank })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="white">White</option>
                <option value="blue">Blue</option>
                <option value="purple">Purple</option>
                <option value="brown">Brown</option>
                <option value="black">Black</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video URL (optional)
            </label>
            <input
              type="url"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://example.com/video"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? 'Adding...' : 'Add Technique'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
