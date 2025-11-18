import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  BoltIcon,
  WrenchScrewdriverIcon,
  DevicePhoneMobileIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, current: true },
  { name: 'Energy', href: '/energy', icon: BoltIcon, current: false },
  { name: 'Maintenance', href: '/maintenance', icon: WrenchScrewdriverIcon, current: false },
  { name: 'Devices', href: '/devices', icon: DevicePhoneMobileIcon, current: false },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon, current: false },
];

const Sidebar = ({ onNavigate }) => {
  const location = useLocation();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 flex-shrink-0 items-center px-6">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-md bg-primary-600 flex items-center justify-center">
            <BoltIcon className="h-5 w-5 text-white" />
          </div>
          <span className="ml-3 text-lg font-semibold text-gray-900">Smart Campus</span>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onNavigate}
              className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon
                className={`mr-3 h-6 w-6 flex-shrink-0 ${
                  isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                }`}
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
      
      <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
        <button
          type="button"
          className="group block w-full flex-shrink-0"
        >
          <div className="flex items-center">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-200">
              <span className="text-sm font-medium text-gray-700">AU</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Admin User</p>
              <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">View profile</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
