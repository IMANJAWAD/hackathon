import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EnergyGraph = ({ data = [], buildings = [], timeRange = '24h' }) => {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timestamp" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => {
              if (timeRange === '24h') {
                return value.split(':')[0] + 'h';
              }
              return value;
            }}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(value) => `Time: ${value}`}
            formatter={(value, name) => [`${value} kWh`, name]}
          />
          <Legend />
          {(buildings || []).map((building, index) => (
            <Line
              key={building.id}
              type="monotone"
              dataKey={building.name}
              stroke={`hsl(${(index * 360) / buildings.length}, 70%, 50%)`}
              activeDot={{ r: 6 }}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnergyGraph;
