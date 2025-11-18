import React from 'react';
import { 
  WifiIcon, 
  Battery50Icon, 
  ClockIcon, 
  DeviceTabletIcon,
  LightBulbIcon,
  PowerIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';

const DeviceCard = ({ device, onClick }) => {
  const getStatusColor = () => {
    switch (device.status) {
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'offline':
        return 'bg-gray-100 text-gray-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeviceIcon = () => {
    const iconClass = 'h-5 w-5';
    
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

  const formatLastSeen = (lastSeen) => {
    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffInMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 60 * 24) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / (60 * 24))}d ago`;
  };

  const renderDeviceSpecificInfo = () => {
    switch (device.type) {
      case 'sensor':
        return (
          <div className="mt-2">
            {device.temperature !== undefined && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Temp:</span> {device.temperature}°C
              </p>
            )}
            {device.humidity !== undefined && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Humidity:</span> {device.humidity}%
              </p>
            )}
            {device.airQuality && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Air Quality:</span> {device.airQuality}
              </p>
            )}
          </div>
        );
      case 'light':
        return (
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Brightness:</span> {device.brightness}%
            </p>
            {device.color && (
              <div className="flex items-center mt-1">
                <span className="font-medium text-sm text-gray-600 mr-2">Color:</span>
                <div 
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: device.color }}
                  title={device.color}
                />
              </div>
            )}
          </div>
        );
      case 'plug':
        return (
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Status:</span> {device.isOn ? 'On' : 'Off'}
            </p>
            {device.powerConsumption !== undefined && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Power:</span> {device.powerConsumption}W
              </p>
            )}
          </div>
        );
      case 'camera':
        return (
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Status:</span> {device.isStreaming ? 'Streaming' : 'Idle'}
            </p>
            {device.lastRecording && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Last Recording:</span> {formatLastSeen(device.lastRecording)}
              </p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={onClick}
    >
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {getDeviceIcon()}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">{device.name}</h3>
              <p className="text-sm text-gray-500">{device.building} • {device.room}</p>
            </div>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
          </span>
        </div>

        {renderDeviceSpecificInfo()}

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <WifiIcon className="h-4 w-4 mr-1" />
              <span>{device.signal || 0}/5</span>
            </div>
            {device.battery > 0 && (
              <div className="flex items-center">
                <Battery50Icon className="h-4 w-4 mr-1" />
                <span>{device.battery}%</span>
              </div>
            )}
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              <span>{formatLastSeen(device.lastSeen)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceCard;
