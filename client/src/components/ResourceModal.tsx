import React from 'react';
import { IconX, IconBook, IconBookmark } from '@tabler/icons-react';
import { Topic } from '../types';

interface ModalProps {
  topic: Topic;
  onClose: () => void;
}

const ResourceModal: React.FC<ModalProps> = ({ topic, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 max-w-3xl w-full relative" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-4 right-4 p-1" onClick={onClose}>
          <IconX size={24} className="text-gray-600" />
        </button>
        <h3 className="text-2xl font-bold mb-6">Resources for {topic.title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topic.resources.map((resource) => (
            <div key={resource.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  {resource.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{resource.title}</h4>
                  <div className="text-sm text-gray-600">{resource.type}</div>
                  <div className="text-sm text-gray-500 mt-1">{resource.duration}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourceModal;
