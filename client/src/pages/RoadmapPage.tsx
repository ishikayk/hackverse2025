import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IconBook, IconCode, IconPlayerPlay, IconWriting, IconClipboardSearch, IconSparkles } from "@tabler/icons-react";
import Roadmap from "../components/Roadmap.tsx";
import Progress from "../components/Progress.tsx";
import { Topic } from "../types";

const RoadmapPage: React.FC = () => {
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
          Your Personalized Roadmap 
        </h2>
        <button
          onClick={() => navigate('/chat', { state: { roadmap: roadmapData } })}
          className="bg-gradient-to-br from-rose-500 to-pink-400 hover:bg-gradient-to-br hover:from-rose-700 hover:to-pink-600 text-white px-8 py-4 w-[12rem] h-[4rem] ml-[2rem] rounded-lg font-medium transition-colors fixed top-24 flex justify-center items-center gap-2"
        >
          Ask a Doubt
          <IconSparkles size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto mt-20 pt-4 pl-8">
        <Roadmap topics={topicsWithIcons} />
        <div className="grid place-items-center">
          <button
            onClick={() => { navigate("/quiz", { state: { roadmapData } }) }}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:bg-gradient-to-r hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 rounded-lg font-medium fixed bottom-8 right-[18rem] z-50"
          >
            Take Final Quiz
          </button>
        </div>
      </div>

      {/* Progress Section */}
      <div className="w-1/3 fixed right-0 h-screen pt-8 pr-8">
        <Progress />
      </div>
    </div>
  );
};

export default RoadmapPage;