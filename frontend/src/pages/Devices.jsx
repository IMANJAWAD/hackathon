import React, { useState, useEffect } from 'react';
import { PlusIcon, DeviceTabletIcon, FunnelIcon, SearchIcon } from '@heroicons/react/outline';
import DeviceCard from '../components/DeviceCard';
import DeviceDetailsModal from '../components/DeviceDetailsModal';
import { devicesAPI } from '../services/api';

const DevicesPage = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    building: 'all'
  });

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        // In a real app: const response = await devicesAPI.getDevices();
        // setDevices(response.data);
        
        // Mock data
        const mockDevices = [
          {
            id: 'd1',
            name: 'Temperature Sensor - 101',
            type: 'sensor',
            status: 'online',
            building: 'Block A',
            room: 'Room 101',
            lastSeen: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
            battery: 78,
            signal: 4,
            temperature: 23.5,
            humidity: 45,
            firmware: 'v2.3.1'
          },
          {
            id: 'd2',
            name: 'Smart Light - Lobby',
            type: 'light',
            status: 'offline',
            building: 'Main Building',
            room: 'Lobby',
            lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            battery: 65,
            signal: 3,
            brightness: 75,
            color: '#ffffff',
            firmware: 'v1.5.2'
          },
          {
            id: 'd3',
            name: 'Motion Sensor - Corridor',
            type: 'sensor',
            status: 'online',
            building: 'Block B',
            room: '1st Floor Corridor',
            lastSeen: new Date().toISOString(),
            battery: 92,
            signal: 5,
            motionDetected: false,
            firmware: 'v3.0.1'
          },
          {
            id: 'd4',
            name: 'Smart Plug - Lab 3',
            type: 'plug',
            status: 'online',
            building: 'Lab Complex',
            room: 'Lab 3',
            lastSeen: new Date().toISOString(),
            battery: 0, // Wired device
            signal: 5,
            powerConsumption: 120,
            isOn: true,
            firmware: 'v2.1.0'
          },
          {
            id: 'd5',
            name: 'Air Quality Monitor - Library',
            type: 'sensor',
            status: 'warning',
            building: 'Library',
            room: 'Reading Area',
            lastSeen: new Date().toISOString(),
            battery: 23,
            signal: 2,
            airQuality: 'moderate',
            co2: 850,
            tvoc: 0.5,
            firmware: 'v1.8.3'
          }
        ];
        setDevices(mockDevices);
      } catch (error) {
        console.error('Error fetching devices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  const filteredDevices = devices.filter(device => {
    // Search filter
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.room.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = filters.status === 'all' || device.status === filters.status;
    
    // Type filter
    const matchesType = filters.type === 'all' || device.type === filters.type;
    
    // Building filter
    const matchesBuilding = filters.building === 'all' || device.building === filters.building;
    
    return matchesSearch && matchesStatus && matchesType && matchesBuilding;
  });

  const handleDeviceClick = (device) => {
    setSelectedDevice(device);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDevice(null);
  };

  const handleUpdateDevice = (updatedDevice) => {
    setDevices(devices.map(device => 
      device.id === updatedDevice.id ? updatedDevice : device
    ));
    setSelectedDevice(updatedDevice);
  };

  const getBuildings = () => {
    const buildings = new Set(devices.map(device => device.building));
    return Array.from(buildings).sort();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Device Management</h1>
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add Device
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow rounded-lg p-4 space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search devices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status-filter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="all">All Statuses</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="warning">Warning</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700">
              Device Type
            </label>
            <select
              id="type-filter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
            >
              <option value="all">All Types</option>
              <option value="sensor">Sensors</option>
              <option value="light">Lights</option>
              <option value="plug">Smart Plugs</option>
              <option value="camera">Cameras</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="building-filter" className="block text-sm font-medium text-gray-700">
              Building
            </label>
            <select
              id="building-filter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={filters.building}
              onChange={(e) => setFilters({...filters, building: e.target.value})}
            >
              <option value="all">All Buildings</option>
              {getBuildings().map((building) => (
                <option key={building} value={building}>
                  {building}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Devices Grid */}
      {filteredDevices.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDevices.map((device) => (
            <DeviceCard 
              key={device.id} 
              device={device} 
              onClick={() => handleDeviceClick(device)} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <DeviceTabletIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No devices found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || Object.values(filters).some(f => f !== 'all')
              ? 'Try adjusting your search or filter criteria.'
              : 'No devices have been added yet.'}
          </p>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add Device
            </button>
          </div>
        </div>
      )}

      {/* Device Details Modal */}
      {selectedDevice && (
        <DeviceDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          device={selectedDevice}
          onUpdate={handleUpdateDevice}
        />
      )}
    </div>
  );
};

export default DevicesPage;
