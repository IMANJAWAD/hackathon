// In-memory data store for demo
const energyData = {
  buildings: ['Block A', 'Block B', 'Library', 'Lab Complex'],
  currentReadings: {},
  historicalData: {}
};

// Initialize with some sample data
energyData.buildings.forEach(building => {
  energyData.currentReadings[building] = {
    building,
    voltage: Math.floor(Math.random() * 20) + 220, // 220-240V
    current: (Math.random() * 5 + 1).toFixed(2), // 1-6A
    powerConsumption: (Math.random() * 5 + 1).toFixed(2), // 1-6 kW
    alertStatus: Math.random() > 0.8 ? 'warning' : 'normal',
    timestamp: new Date()
  };

  // Generate some historical data
  energyData.historicalData[building] = [];
  const now = new Date();
  for (let i = 0; i < 24; i++) {
    const time = new Date(now - i * 60 * 60 * 1000);
    energyData.historicalData[building].push({
      timestamp: time,
      powerConsumption: (Math.random() * 5 + 1).toFixed(2),
      voltage: Math.floor(Math.random() * 20) + 220,
      current: (Math.random() * 5 + 1).toFixed(2),
      alertStatus: Math.random() > 0.9 ? 'warning' : 'normal'
    });
  }
});

const EnergyController = {
  // Get latest energy readings for all buildings
  async getLiveEnergy(req, res) {
    try {
      // Update readings slightly for demo purposes
      energyData.buildings.forEach(building => {
        const reading = energyData.currentReadings[building];
        reading.voltage = Math.max(210, Math.min(240, reading.voltage + (Math.random() * 2 - 1)));
        reading.current = Math.max(0.5, Math.min(10, parseFloat(reading.current) + (Math.random() * 0.4 - 0.2)).toFixed(2));
        reading.powerConsumption = (parseFloat(reading.voltage) * parseFloat(reading.current) / 1000).toFixed(2);
        reading.timestamp = new Date();
        
        // Occasionally trigger an alert
        if (Math.random() > 0.95) {
          reading.alertStatus = 'warning';
        } else if (Math.random() > 0.8) {
          reading.alertStatus = 'normal';
        }
      });

      // Convert object to array and return
      const latestReadings = Object.values(energyData.currentReadings);
      res.json(latestReadings);
    } catch (error) {
      console.error('Error fetching live energy data:', error);
      res.status(500).json({ error: 'Failed to fetch live energy data' });
    }
  },

  // Get historical energy data for a specific building
  async getEnergyHistory(req, res) {
    try {
      const { building } = req.params;
      const { hours = 24 } = req.query;
      
      if (!energyData.historicalData[building]) {
        return res.status(404).json({ error: 'Building not found' });
      }
      
      // Get the most recent data points within the requested time range
      const now = new Date();
      const startTime = new Date(now - hours * 60 * 60 * 1000);
      
      // Filter data for the requested time range
      const history = energyData.historicalData[building]
        .filter(entry => new Date(entry.timestamp) >= startTime)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      
      // If we don't have enough data, generate some more
      if (history.length < 24) {
        const lastEntry = history[history.length - 1] || {
          powerConsumption: (Math.random() * 5 + 1).toFixed(2),
          voltage: Math.floor(Math.random() * 20) + 220,
          current: (Math.random() * 5 + 1).toFixed(2),
          alertStatus: 'normal'
        };
        
        const entriesNeeded = 24 - history.length;
        for (let i = 0; i < entriesNeeded; i++) {
          const time = new Date(now - (entriesNeeded - i) * 60 * 60 * 1000);
          history.push({
            timestamp: time,
            powerConsumption: Math.max(0.5, Math.min(10, 
              parseFloat(lastEntry.powerConsumption) + (Math.random() * 0.4 - 0.2)
            )).toFixed(2),
            voltage: Math.max(210, Math.min(240, 
              parseFloat(lastEntry.voltage) + (Math.random() * 2 - 1)
            )),
            current: Math.max(0.5, Math.min(10, 
              parseFloat(lastEntry.current) + (Math.random() * 0.4 - 0.2)
            )).toFixed(2),
            alertStatus: Math.random() > 0.9 ? 'warning' : 'normal'
          });
        }
      }
      
      res.json(history);
    } catch (error) {
      console.error('Error fetching energy history:', error);
      res.status(500).json({ error: 'Failed to fetch energy history' });
    }
  },

  // Get current energy alerts
  async getEnergyAlerts(req, res) {
    try {
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);
      
      // Get all current readings with alerts
      const alerts = [];
      
      // Check current readings for alerts
      Object.values(energyData.currentReadings).forEach(reading => {
        if (reading.alertStatus === 'warning' || reading.alertStatus === 'critical') {
          alerts.push({
            building: reading.building,
            alertStatus: reading.alertStatus,
            message: `Abnormal ${reading.alertStatus} level detected in ${reading.building}`,
            timestamp: reading.timestamp,
            alertCount: 1
          });
        }
      });
      
      // Check historical data for recent alerts
      Object.entries(energyData.historicalData).forEach(([building, entries]) => {
        const recentAlerts = entries
          .filter(entry => 
            new Date(entry.timestamp) >= oneHourAgo && 
            (entry.alertStatus === 'warning' || entry.alertStatus === 'critical')
          )
          .map(entry => ({
            building,
            alertStatus: entry.alertStatus,
            message: `Abnormal ${entry.alertStatus} level detected in ${building}`,
            timestamp: entry.timestamp,
            alertCount: 1
          }));
          
        alerts.push(...recentAlerts);
      });
      
      // Sort by timestamp (newest first)
      alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      // Group by building and get the latest alert for each
      const uniqueAlerts = [];
      const seenBuildings = new Set();
      
      for (const alert of alerts) {
        if (!seenBuildings.has(alert.building)) {
          seenBuildings.add(alert.building);
          uniqueAlerts.push(alert);
        }
      }
      
      res.json(uniqueAlerts);
    } catch (error) {
      console.error('Error fetching energy alerts:', error);
      res.status(500).json({ error: 'Failed to fetch energy alerts' });
    }
  }
};

module.exports = EnergyController;
