import React from 'react';
import { BoltIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const BuildingCard = ({ building = {}, isSelected = false, onSelect = () => {} }) => {
  // Ensure building has all required properties with defaults
  const safeBuilding = {
    id: building?.id || 'unknown',
    name: building?.name || 'Unknown Building',
    status: building?.status?.toLowerCase() || 'normal',
    currentUsage: building?.currentUsage ?? 0,
    dailyUsage: building?.dailyUsage ?? 0,
    deviceCount: building?.deviceCount ?? 0
  };
  const getStatusColor = () => {
    const status = safeBuilding.status;
    switch (status) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'normal':
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getStatusIcon = () => {
    const status = safeBuilding.status;
    if (status === 'critical' || status === 'warning') {
      return (
        <ExclamationTriangleIcon
          className={`h-5 w-5 ${
            status === 'critical' ? 'text-red-500' : 'text-yellow-500'
          }`}
          aria-hidden="true"
        />
      );
    }
    return <BoltIcon className="h-5 w-5 text-green-500" aria-hidden="true" />;
  };

  return (
    <div
      className={`p-4 rounded-lg border ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
      } transition-colors cursor-pointer bg-white shadow-sm`}
      onClick={() => onSelect(safeBuilding.id)}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-gray-900">{safeBuilding.name}</h3>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}
        >
          {safeBuilding.status.toUpperCase()}
        </span>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Current Usage</p>
          <p className="text-lg font-semibold text-gray-900">
            {safeBuilding.currentUsage} <span className="text-sm font-normal text-gray-500">kW</span>
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Today</p>
          <p className="text-lg font-semibold text-gray-900">
            {safeBuilding.dailyUsage} <span className="text-sm font-normal text-gray-500">kWh</span>
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Devices</p>
          <p className="text-lg font-semibold text-gray-900">{safeBuilding.deviceCount}</p>
        </div>
        <div className="flex items-end justify-end">
          {getStatusIcon()}
        </div>
      </div>
    </div>
  );
};

export default BuildingCard;
