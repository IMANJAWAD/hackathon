import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowPathIcon,
  BoltIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

// Components
import BuildingCard from '../components/BuildingCard';
import EnergyGraph from '../components/EnergyGraph';
import AlertPanel from '../components/EnergyAlertPanel';

// Mock data (will be replaced with real API calls)
const mockBuildings = ['Block A', 'Block B', 'Library', 'Lab Complex'];
const mockAlerts = [
  { id: 1, type: 'warning', message: 'High energy consumption in Block A', time: '2 min ago' },
  { id: 2, type: 'critical', message: 'Power surge detected in Lab Complex', time: '5 min ago' },
  { id: 3, type: 'warning', message: 'Voltage fluctuation in Block B', time: '15 min ago' },
];

const DashboardEnergy = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [buildings, setBuildings] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setBuildings(mockBuildings);
      setAlerts(mockAlerts);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleBuildingClick = (building) => {
    setSelectedBuilding(building);
    // In a real app, you would fetch detailed data for the selected building
  };

  const handleDismissAlert = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Energy Dashboard
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Monitor real-time energy consumption across campus buildings
            </p>
          </div>
          <div className="flex space-x-3
          ">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <ArrowPathIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
              Refresh
            </button>
            <Link
              to="/settings/energy"
              className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              <BoltIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Settings
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Power Consumption</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            1,248 <span className="text-lg text-gray-500">kWh</span>
          </dd>
          <div className="mt-2 flex items-baseline text-sm font-semibold text-green-600">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1.5" />
            12% below average
          </div>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Active Alerts</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            3 <span className="text-lg text-gray-500">alerts</span>
          </dd>
          <div className="mt-2 flex items-baseline text-sm font-semibold text-yellow-600">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-1.5" />
            2 critical
          </div>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Buildings</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {buildings.length} <span className="text-lg text-gray-500">buildings</span>
          </dd>
          <div className="mt-2 text-sm text-gray-500">4 monitored locations</div>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Current Peak Load</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            98 <span className="text-lg text-gray-500">kW</span>
          </dd>
          <div className="mt-2 flex items-baseline text-sm font-semibold text-red-600">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-1.5" />
            5% over limit
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Alerts */}
        <div className="lg:col-span-1">
          <AlertPanel alerts={alerts} onDismiss={handleDismissAlert} />
        </div>

        {/* Right Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Energy Graph */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Energy Consumption (Last 24 Hours)</h3>
            <div className="h-80">
              <EnergyGraph />
            </div>
          </div>

          {/* Building Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {buildings.map((building) => (
              <BuildingCard 
                key={building}
                building={building}
                onClick={() => handleBuildingClick(building)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardEnergy;
