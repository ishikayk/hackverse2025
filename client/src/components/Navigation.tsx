import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { IconUser } from '@tabler/icons-react';


const Navigation: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const userProfilePic = "https://avatar.iran.liara.run/public/81";
  
  return (
    <nav className="sticky top-0 bg-white shadow-md z-50">
      <div className="mx-0 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex  align-center flex-shrink-0">
            <NavLink to="/" className="text-xl font-bold text-blue-600">
              BlockSentinels
            </NavLink>
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              <NavLink to="/profile" className="flex items-center space-x-2">
                <div className="relative">
                  <img
                    src={userProfilePic}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-rose-100"
                  />
                  <div className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1 rounded-full">
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