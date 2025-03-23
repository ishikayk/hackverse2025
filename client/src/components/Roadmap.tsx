import React, { useState } from "react";
import { IconCheck, IconBook, IconCode, IconPlayerPlay, IconWriting } from "@tabler/icons-react";
import ResourceModal from "./ResourceModal";
import { Topic } from "../types";

const getIconForType = (type: string) => {
  switch (type) {
    case 'video': return <IconPlayerPlay size={20} />;
    case 'written': return <IconBook size={20} />;
    case 'project': return <IconCode size={20} />;
    case 'exercises': return <IconWriting size={20} />;
    default: return <IconCheck size={20} />;
  }
};

interface RoadmapProps {
  topics: Topic[];
}

const Roadmap: React.FC<RoadmapProps> = ({ topics }) => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  return (
    <div className="w-2/3 overflow-y-auto pr-4 mt-24">
      {/* Vertical Timeline */}
      <div className="relative flex flex-col items-center">
        {topics.map((topic, index) => (
          <div key={topic.id} className="w-full flex flex-col items-center mb-8">
            {/* Connector */}
            {index !== 0 && (
              <div className="w-1 h-16 bg-slate-100 rounded-full mb-4" />
            )}

            {/* Step Card */}
            <div className="flex items-center group cursor-pointer" onClick={() => setSelectedTopic(topic)}>
              <div className={`w-20 h-20 rounded-full flex items-center justify-center
                ${["bg-green-500", "bg-blue-500", "bg-purple-500", "bg-yellow-500", "bg-pink-500"][index % 5]}
                text-white text-2xl font-bold shadow-lg transition-transform hover:scale-110`}>
                {index + 1}
              </div>
              {/* Title Card */}
              <div  className="ml-8 p-8 bg-white rounded-lg shadow-md transition-all hover:shadow-lg w-[32rem]">
                <h3 className="text-xl font-semibold text-gray-800">{topic.title}</h3>
              </div>
            </div>

            {/* Resources List */}
            <div className="ml-28 mt-6 space-y-4">
              {topic.resources.map((resource) => (
                <div key={resource.id} className="flex items-center p-4 rounded-lg bg-white shadow-sm">
                  <div className="p-3 rounded-md bg-blue-100 text-blue-600">
                    {resource.icon || getIconForType(resource.type)}
                  </div>
                  <div className="ml-2 w-[20rem]">
                    <h4 className="text-sm font-medium">{resource.title}</h4>
                    <p className="text-sm text-gray-500">
                      {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)} • {resource.duration}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Popup for Resources */}
      {selectedTopic && <ResourceModal topic={selectedTopic} onClose={() => setSelectedTopic(null)} />}
    </div>
  );
};

export default Roadmap;