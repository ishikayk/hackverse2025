import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IconBook, IconCode, IconPlayerPlay, IconWriting, IconClipboardSearch, IconSparkles } from "@tabler/icons-react";
import Roadmap from "../components/Roadmap.tsx";
import Progress from "../components/Progress.tsx";
import { Topic } from "../types";

interface RoadmapPageProps {
  heading: string;
}

const RoadmapPage: React.FC<RoadmapPageProps> = ({heading}) => {
  const location = useLocation();
  console.log(location.state?.responseData); 
  const roadmapData = location.state?.responseData?.result; 

  const navigate = useNavigate();

  const dummyData: Topic[] = [
    {
      id: 1,
      title: "Introduction to Web3",
      resources: [
        {
          id: "r1",
          title: "What is Web3?",
          type: "Video",
          duration: "15 min",
          icon: <IconPlayerPlay size={20} />, 
        },
        {
          id: "r2",
          title: "Blockchain Basics",
          type: "Written",
          duration: "20 min",
          icon: <IconBook size={20} />, 
        },
      ],
    },
    {
      id: 2,
      title: "Smart Contracts",
      resources: [
        {
          id: "r3",
          title: "Solidity Basics",
          type: "Video",
          duration: "25 min",
          icon: <IconPlayerPlay size={20} />, 
        },
        {
          id: "r4",
          title: "Deploying Contracts",
          type: "Project",
          duration: "45 min",
          icon: <IconCode size={20} />, 
        },
      ],
    },
  ];

  // Use dummy data if roadmapData is not provided or invalid
  const dataToRender = Array.isArray(roadmapData) ? roadmapData : dummyData;

  const getIconForResourceType = (type: string) => {
    switch (type.toLowerCase()) {
      case "video":
        return <IconPlayerPlay size={20} />;
      case "written":
        return <IconBook size={20} />;
      case "exercises":
        return <IconWriting size={20} />;
      case "project":
        return <IconCode size={20} />;
      default:
        return <IconClipboardSearch size={20} />;
    }
  };

  const topicsWithIcons: Topic[] = dataToRender.map((topic: Topic) => ({
    ...topic,
    resources: topic.resources.map((resource) => ({
      ...resource,
      icon: resource.icon || getIconForResourceType(resource.type), 
    })),
  }));

  return (
    <div className="w-screen h-screen flex">
      <div className="fixed top-25 w-full bg-zinc-100 z-40">
        <h2 className="text-4xl font-bold text-center py-4">
          Your Personalized {`${heading}`} Roadmap
        </h2>
        <button
          onClick={() => navigate('/chat', { state: { roadmap: roadmapData } })}
          className="bg-gradient-to-l from-green-400 to-cyan-500 hover:bg-purple-600 text-white px-4 py-2 h-[24rem] rounded-lg font-medium transition-colors fixed top-24 flex items-center gap-2"
        >
          Ask a Doubt
          <IconSparkles size={20} />
        </button>
      </div>

      {/* Scrollable Roadmap */}
      <div className="flex-1 overflow-y-auto mt-20 pt-4 pl-8">
        <Roadmap topics={topicsWithIcons} />
      </div>

      {/* Progress Section */}
      <div className="w-1/3 fixed top-24 right-0 h-screen pt-8 pr-8">
        <Progress />
      </div>
    </div>
  );
};

export default RoadmapPage;   