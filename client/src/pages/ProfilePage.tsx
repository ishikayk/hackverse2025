import React from 'react';
import { IconUser, IconSchool, IconCertificate, IconClock, IconStar } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const user = {
    name: "Sarah Johnson",
    email: "sarah@web3dev.com",
    completedCourses: 8,
    learningHours: 120,
    rating: 4.7,
    memberSince: "2023",
    avatar: "https://avatar.iran.liara.run/public/81" 
  };

    const navigate = useNavigate();
  
    const handleStart = () => {
      navigate('/start');
    };
    
  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <div className="relative">
            <img 
              src={user.avatar}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-purple-100"
            />
            <div className="absolute bottom-0 right-0 bg-purple-500 text-white p-2 rounded-full">
              <IconUser size={20} />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{user.name}</h1>
            <p className="text-gray-600 mb-4">{user.email}</p>
            <div className="flex gap-4 justify-center md:justify-start">
              <button onClick={handleStart} className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
                <IconSchool size={20} />
                Start New Course
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
                <IconCertificate size={20} />
                View Certificates
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-tl from-purple-500 to-indigo-500 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 text-white rounded-lg">
                <IconSchool size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-300">{user.completedCourses}</div>
                <div className="text-sm text-white">Courses Completed</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-tl from-sky-400 to-indigo-500 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 text-white rounded-lg">
                <IconClock size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-sky-300">{user.learningHours}</div>
                <div className="text-sm text-white">Total Hours</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-tl from-green-400 to-cyan-500 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 text-white rounded-lg">
                <IconStar size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-300">{user.rating}</div>
                <div className="text-sm text-white">Average Rating</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-rose-500 to-pink-400 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-500 text-white rounded-lg">
                <IconUser size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-pink-300">{user.memberSince}</div>
                <div className="text-sm text-white">Member Since</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="border-t pt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <IconCertificate className="text-green-500 mr-4" size={24} />
              <div>
                <h3 className="font-medium">Completed "Smart Contracts 101"</h3>
                <p className="text-sm text-gray-500">2 days ago</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <IconSchool className="text-blue-500 mr-4" size={24} />
              <div>
                <h3 className="font-medium">Started "Web3 Security" course</h3>
                <p className="text-sm text-gray-500">5 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;