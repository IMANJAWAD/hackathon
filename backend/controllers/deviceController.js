const Device = require('../models/Device');

// Initialize Socket.IO
let io;

// Function to set Socket.IO instance
const setSocketIO = (socketIO) => {
  io = socketIO;
};

const DeviceController = {
  // Get all devices with current status
  async getAllDevices(req, res) {
    try {
      const { building, type, status } = req.query;
      
      // Build filter object based on query parameters
      const filter = {};
      if (building) filter.building = building;
      if (type) filter.type = type;
      if (status) filter.status = status;

      const devices = await Device.find(filter)
        .sort({ building: 1, type: 1, name: 1 })
        .select('-__v -createdAt -updatedAt')
        .lean();

      res.json(devices);
    } catch (error) {
      console.error('Error fetching devices:', error);
      res.status(500).json({ error: 'Failed to fetch devices' });
    }
  },

  // Get specific device by ID
  async getDeviceById(req, res) {
    try {
      const { id } = req.params;
      
      const device = await Device.findOne({ deviceId: id })
        .select('-__v')
        .lean();

      if (!device) {
        return res.status(404).json({ error: 'Device not found' });
      }

      res.json(device);
    } catch (error) {
      console.error('Error fetching device:', error);
      res.status(500).json({ error: 'Failed to fetch device' });
    }
  },

  // Get current status of all devices (simplified for dashboard)
  async getDeviceStatus(req, res) {
    try {
      const devices = await Device.find({})
        .select('deviceId building type temperature health status lastUpdated')
        .sort({ building: 1, type: 1 })
        .lean();

      // Format for dashboard
      const deviceStatus = devices.map(device => ({
        deviceId: device.deviceId,
        building: device.building,
        type: device.type,
        temperature: device.temperature,
        health: device.health,
        status: device.status,
        lastUpdated: device.lastUpdated,
        needsAttention: device.health < 40 || device.temperature > 60 || device.status === 'Faulty'
      }));

      res.json(deviceStatus);
    } catch (error) {
      console.error('Error fetching device status:', error);
      res.status(500).json({ error: 'Failed to fetch device status' });
    }
  },

  // Update device status (for simulation)
  async updateDeviceStatus(deviceId, updateData) {
    try {
      const device = await Device.findOneAndUpdate(
        { deviceId },
        { 
          ...updateData,
          lastUpdated: new Date()
        },
        { new: true, runValidators: true }
      );

      if (!device) {
        throw new Error(`Device ${deviceId} not found`);
      }

      // Emit Socket.IO event
      if (io) {
        io.emit('deviceStatusUpdate', {
          deviceId: device.deviceId,
          status: device.status,
          health: device.health,
          temperature: device.temperature,
          lastUpdated: device.lastUpdated
        });
      }

      return device;
    } catch (error) {
      console.error('Error updating device status:', error);
      throw error;
    }
  },

  // Set Socket.IO instance
  setSocketIO
};

module.exports = DeviceController;
