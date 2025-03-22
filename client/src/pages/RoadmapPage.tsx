import React from "react";
import { useLocation } from "react-router-dom";
import { IconBook, IconCode, IconPlayerPlay, IconWriting } from "@tabler/icons-react";
import Roadmap from "../components/Roadmap.tsx";
import Progress from "../components/Progress.tsx";
import { Topic } from "../types";

const RoadmapPage: React.FC = () => {
  const location = useLocation();
  console.log(location.state?.responseData); // Log the entire response
  const roadmapData = location.state?.responseData?.result; // Adjust based on API response

  // Helper function to get icons based on resource type
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
        return null;
    }
  };

  if (!roadmapData) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold text-center">
          No roadmap data found. Please go back and generate a roadmap.
        </h2>
      </div>
    );
  }

  if (!Array.isArray(roadmapData)) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold text-center">
          Invalid roadmap data. Please go back and try again.
        </h2>
      </div>
    );
  }

  const topicsWithIcons: Topic[] = roadmapData.map((topic: Topic) => ({
    ...topic,
    resources: topic.resources.map((resource) => ({
      ...resource,
      icon: getIconForResourceType(resource.type), // Now this works
    })),
  }));

  return (
    <div className="w-screen h-screen flex">
      <div className="fixed top-25 w-full bg-zinc-100 z-40">
        <h2 className="text-4xl font-bold text-center py-4">
          Your Personalized Web3 Roadmap
        </h2>
      </div>

      {/* Scrollable Roadmap */}
      <div className="flex-1 overflow-y-auto mt-20 pt-4 pl-8">
        <Roadmap topics={topicsWithIcons} />
      </div>

      {/* Fixed Progress Section */}
      <div className="w-1/3 fixed top-24 right-0 h-screen pt-8 pr-8">
        <Progress />
      </div>
    </div>
  );
};

export default RoadmapPage;