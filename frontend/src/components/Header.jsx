import React from 'react';
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline';

const Header = ({ onMenuClick }) => {
  return (
    <header className="flex items-center justify-between bg-white shadow-sm px-4 py-3 lg:px-6">
      <div className="flex items-center
      ">
        <button
          type="button"
          className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
          onClick={onMenuClick}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
        <h1 className="ml-2 text-xl font-semibold text-gray-900">Smart Campus IoT</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <button
          type="button"
          className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <span className="sr-only">View notifications</span>
          <BellIcon className="h-6 w-6" aria-hidden="true" />
        </button>
        
        {/* User profile dropdown */}
        <div className="relative">
          <button
            type="button"
            className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            id="user-menu-button"
            aria-expanded="false"
            aria-haspopup="true"
          >
            <span className="sr-only">Open user menu</span>
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
              AU
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
