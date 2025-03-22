import React from "react";
import { IconBook, IconCode, IconPlayerPlay, IconWriting } from "@tabler/icons-react";
import Roadmap from "../components/Roadmap.tsx";
import Progress from "../components/Progress.tsx";
import { Topic, Stats } from "../types";
const topicCheckpoints: Topic[] = [
  {
    id: 1,
    title: "Understanding the basics",
    resources: [
      { id: 'r1', title: 'Blockchain 101 Video', type: 'Video', duration: '32 min', icon: <IconPlayerPlay size={20} /> },
      { id: 'r2', title: 'Basic Concepts Guide', type: 'Written', duration: '20 min', icon: <IconBook size={20} /> },
      { id: 'r3', title: 'Crypto Terminology Exercises', type: 'Exercises', duration: '20 min', icon: <IconWriting size={20} /> }
    ]
  },
  {
    id: 2,
    title: "Learn Blockchain Fundamentals",
    resources: [
      { id: 'r4', title: 'Cryptography Exercises', type: 'Exercises', duration: '20 min', icon: <IconWriting size={20} /> },
      { id: 'r5', title: 'Consensus Mechanisms Video', type: 'Video', duration: '25 min', icon: <IconPlayerPlay size={20} /> },
      { id: 'r6', title: 'Blockchain Architecture Guide', type: 'Written', duration: '15 min', icon: <IconBook size={20} /> }
    ]
  },
  {
    id: 3,
    title: "Hands-On with Smart Contracts",
    resources: [
      { id: 'r7', title: 'Solidity Tutorial Project', type: 'Project', duration: '45 min', icon: <IconCode size={20} /> },
      { id: 'r8', title: 'Smart Contract Patterns Guide', type: 'Written', duration: '30 min', icon: <IconBook size={20} /> },
      { id: 'r9', title: 'Deploying Contracts Video', type: 'Video', duration: '20 min', icon: <IconPlayerPlay size={20} /> }
    ]
  },
  {
    id: 4,
    title: "Explore dApps",
    resources: [
      { id: 'r10', title: 'dApp Architecture Video', type: 'Video', duration: '20 min', icon: <IconPlayerPlay size={20} /> },
      { id: 'r11', title: 'DeFi Case Studies Guide', type: 'Written', duration: '25 min', icon: <IconBook size={20} /> },
      { id: 'r12', title: 'Building a dApp Project', type: 'Project', duration: '60 min', icon: <IconCode size={20} /> }
    ]
  },
  {
    id: 5,
    title: "Dive into Web3 Tools",
    resources: [
      { id: 'r13', title: 'Hardhat Setup Guide', type: 'Written', duration: '30 min', icon: <IconBook size={20} /> },
      { id: 'r14', title: 'IPFS Tutorial Video', type: 'Video', duration: '25 min', icon: <IconPlayerPlay size={20} /> },
      { id: 'r15', title: 'Web3.js Exercises', type: 'Exercises', duration: '40 min', icon: <IconWriting size={20} /> }
    ]
  },
  {
    id: 6,
    title: "Build your Capstone Project",
    resources: [
      { id: 'r16', title: 'Project Requirements Guide', type: 'Written', duration: '15 min', icon: <IconBook size={20} /> },
      { id: 'r17', title: 'Final Submission Video', type: 'Video', duration: '10 min', icon: <IconPlayerPlay size={20} /> },
      { id: 'r18', title: 'Capstone Project Template', type: 'Project', duration: '90 min', icon: <IconCode size={20} /> }
    ]
  }
];

const RoadmapPage: React.FC = () => {
  return (
    <div className="w-screen h-screen flex">
      <div className="fixed top-25 w-full bg-zinc-100 z-40">
        <h2 className="text-4xl font-bold text-center py-4">
          Your Personalized Web3 Roadmap
        </h2>
      </div>

      {/* Scrollable Roadmap */}
      <div className="flex-1 overflow-y-auto mt-20 pt-4 pl-8"> 
        <Roadmap topics={topicCheckpoints} />
      </div>

      {/* Fixed Progress Section */}
      <div className="w-1/3 fixed top-24 right-0 h-screen pt-8 pr-8"> 
        <Progress />
      </div>
    </div>
  );
};

export default RoadmapPage;