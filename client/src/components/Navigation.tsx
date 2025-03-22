import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { IconUser } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

/* 
interface NavigationProps {
  isAuthenticated: boolean;
  userProfilePic?: string; 
}
*/

const Navigation: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const userProfilePic = "https://avatar.iran.liara.run/public/81";
  return (
    <nav className="sticky top-0 bg-white shadow-md z-50">
      <div className="mx-0 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex flex-shrink-0">
            <NavLink to="/" className="text-xl font-bold text-blue-600">
              BlockSentinels
            </NavLink>
              <button className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
                Ask a Doubt
              </button>
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              <NavLink to="/profile" className="flex items-center space-x-2">
                <div className="relative">
                  <img
                    src={userProfilePic}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-blue-100"
                  />
                  <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full">
                    <IconUser size={12} />
                  </div>
                </div>
              </NavLink>
            ) : (
              // Sign In Button
              <NavLink
                to="/signin"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <IconUser size={20} />
                <span>Sign In</span>
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;