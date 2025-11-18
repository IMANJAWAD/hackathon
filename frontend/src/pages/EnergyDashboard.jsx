import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { energyAPI } from '../services/api';
import BuildingCard from '../components/BuildingCard';
import EnergyAlertPanel from '../components/EnergyAlertPanel';

const EnergyDashboard = ({ alerts }) => {
  const [energyData, setEnergyData] = useState([]);
  const [buildings] = useState([
    { id: 'block-a', name: 'Block A', status: 'normal', currentUsage: '245.3', dailyUsage: '1,245.6', deviceCount: 24 },
    { id: 'block-b', name: 'Block B', status: 'warning', currentUsage: '312.8', dailyUsage: '1,578.2', deviceCount: 32 },
    { id: 'library', name: 'Library', status: 'normal', currentUsage: '189.5', dailyUsage: '956.3', deviceCount: 18 },
    { id: 'lab-complex', name: 'Lab Complex', status: 'critical', currentUsage: '412.7', dailyUsage: '2,145.9', deviceCount: 45 },
  ]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedBuilding, setSelectedBuilding] = useState('all');

  useEffect(() => {
    const fetchEnergyData = async () => {
      try {
        setLoading(true);
        // In a real app, we would fetch this from the API
        // const response = await energyAPI.getEnergyHistory(selectedBuilding, timeRange === '24h' ? 24 : 1);
        // setEnergyData(response.data);
        
        // Mock data for demo
        const mockData = Array.from({ length: 24 }, (_, i) => ({
          timestamp: `${i}:00`,
          'Block A': Math.floor(Math.random() * 100) + 200,
          'Block B': Math.floor(Math.random() * 150) + 250,
          'Library': Math.floor(Math.random() * 80) + 150,
          'Lab Complex': Math.floor(Math.random() * 200) + 300,
        }));
        setEnergyData(mockData);
      } catch (error) {
        console.error('Error fetching energy data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnergyData();
  }, [timeRange, selectedBuilding]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">Energy Dashboard</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('24h')}
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === '24h' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            24h
          </button>
          <button
            onClick={() => setTimeRange('1h')}
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === '1h' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            1h
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Energy Consumption</h2>
            <div className="h-80">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={energyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {buildings.map((building, index) => (
                      <Line
                        key={building.id}
                        type="monotone"
                        dataKey={building.name}
                        stroke={`hsl(${index * 90}, 70%, 50%)`}
                        activeDot={{ r: 8 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {buildings.map((building) => (
              <BuildingCard 
                key={building.id} 
                building={building}
                isSelected={selectedBuilding === building.id}
                onSelect={setSelectedBuilding}
              />
            ))}
          </div>
        </div>

        <div>
          <EnergyAlertPanel alerts={alerts} />
        </div>
      </div>
    </div>
  );
};

export default EnergyDashboard;
