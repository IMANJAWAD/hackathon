import React, { useState, useEffect } from 'react';
import { 
  XMarkIcon,
  DeviceTabletIcon,
  LightBulbIcon,
  PowerIcon,
  VideoCameraIcon,
  WifiIcon,
  Battery50Icon,
  ClockIcon,
  MapPinIcon,
  Cog6ToothIcon,
  ArrowPathIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const DeviceDetailsModal = ({ isOpen, onClose, device, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deviceData, setDeviceData] = useState(device);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setDeviceData(device);
    setIsEditing(false);
  }, [device]);

  if (!isOpen || !device) return null;

  const getDeviceIcon = () => {
    const iconClass = 'h-8 w-8';
    
    switch (device.type) {
      case 'sensor':
        return <DeviceTabletIcon className={iconClass} />;
      case 'light':
        return <LightBulbIcon className={iconClass} />;
      case 'plug':
        return <PowerIcon className={iconClass} />;
      case 'camera':
        return <VideoCameraIcon className={iconClass} />;
      default:
        return <DeviceTabletIcon className={iconClass} />;
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDeviceData({
      ...deviceData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // In a real app: await devicesAPI.updateDevice(device.id, deviceData);
      onUpdate(deviceData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating device:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReboot = async () => {
    if (window.confirm('Are you sure you want to reboot this device?')) {
      setIsLoading(true);
      try {
        // In a real app: await devicesAPI.rebootDevice(device.id);
        alert('Device reboot command sent successfully');
      } catch (error) {
        console.error('Error rebooting device:', error);
        alert('Failed to send reboot command');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRemove = async () => {
    if (window.confirm('Are you sure you want to remove this device? This action cannot be undone.')) {
      setIsLoading(true);
      try {
        // In a real app: await devicesAPI.deleteDevice(device.id);
        onClose();
        // In a real app: You might want to refresh the device list here
      } catch (error) {
        console.error('Error removing device:', error);
        alert('Failed to remove device');
        setIsLoading(false);
      }
    }
  };

  const renderDeviceSettings = () => {
    if (!isEditing) return null;

    return (
      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Device Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={deviceData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="building" className="block text-sm font-medium text-gray-700">
              Building
            </label>
            <input
              type="text"
              name="building"
              id="building"
              value={deviceData.building}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="room" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              name="room"
              id="room"
              value={deviceData.room}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {device.type === 'light' && (
          <div>
            <label htmlFor="brightness" className="block text-sm font-medium text-gray-700">
              Brightness: {deviceData.brightness}%
            </label>
            <input
              type="range"
              name="brightness"
              id="brightness"
              min="0"
              max="100"
              value={deviceData.brightness || 0}
              onChange={handleInputChange}
              className="mt-1 block w-full"
            />
          </div>
        )}

        {(device.type === 'light' || device.type === 'plug') && (
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isOn"
              id="isOn"
              checked={deviceData.isOn || false}
              onChange={handleInputChange}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isOn" className="ml-2 block text-sm text-gray-700">
              {device.type === 'light' ? 'Light On' : 'Power On'}
            </label>
          </div>
        )}
      </div>
    );
  };

  const renderDeviceInfo = () => {
    if (isEditing) return null;

    return (
      <div className="mt-6 space-y-4">
        <div className="flex items-center text-sm text-gray-500">
          <DeviceTabletIcon className="mr-2 h-5 w-5 text-gray-400" />
          <span>Type: {device.type.charAt(0).toUpperCase() + device.type.slice(1)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <MapPinIcon className="mr-2 h-5 w-5 text-gray-400" />
          <span>Location: {device.building} • {device.room}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <WifiIcon className="mr-2 h-5 w-5 text-gray-400" />
          <span>Signal: {'★'.repeat(device.signal || 0)}{'☆'.repeat(5 - (device.signal || 0))}</span>
        </div>
        {device.battery > 0 && (
          <div className="flex items-center text-sm text-gray-500">
            <Battery50Icon className="mr-2 h-5 w-5 text-gray-400" />
            <span>Battery: {device.battery}%</span>
          </div>
        )}
        <div className="flex items-center text-sm text-gray-500">
          <ClockIcon className="mr-2 h-5 w-5 text-gray-400" />
          <span>Last seen: {new Date(device.lastSeen).toLocaleString()}</span>
        </div>
        {device.firmware && (
          <div className="flex items-center text-sm text-gray-500">
            <Cog6ToothIcon className="mr-2 h-5 w-5 text-gray-400" />
            <span>Firmware: {device.firmware}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                {getDeviceIcon()}
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                    {isEditing ? 'Edit Device' : device.name}
                  </h3>
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  {renderDeviceInfo()}
                  {renderDeviceSettings()}
                  
                  <div className="mt-6 flex justify-between">
                    <div className="flex space-x-2">
                      {!isEditing && (
                        <>
                          <button
                            type="button"
                            onClick={handleReboot}
                            disabled={isLoading}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            <ArrowPathIcon className="mr-2 h-4 w-4" />
                            Reboot
                          </button>
                          <button
                            type="button"
                            onClick={handleRemove}
                            disabled={isLoading}
                            className="inline-flex items-center rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          >
                            <TrashIcon className="mr-2 h-4 w-4" />
                            Remove
                          </button>
                        </>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => isEditing ? setIsEditing(false) : onClose()}
                        disabled={isLoading}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        {isEditing ? 'Cancel' : 'Close'}
                      </button>
                      
                      <button
                        type={isEditing ? 'submit' : 'button'}
                        onClick={isEditing ? null : () => setIsEditing(true)}
                        disabled={isLoading}
                        className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          isLoading
                            ? 'bg-blue-300'
                            : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : isEditing ? (
                          'Save Changes'
                        ) : (
                          'Edit Device'
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetailsModal;
