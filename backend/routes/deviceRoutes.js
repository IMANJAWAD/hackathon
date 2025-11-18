const express = require('express');
const router = express.Router();
const DeviceController = require('../controllers/deviceController');

// GET /api/devices - Get all devices
router.get('/', async (req, res, next) => {
  try {
    const { building, type, status } = req.query;
    
    // Build filter object
    const filters = {};
    if (building) filters.building = building;
    if (type) filters.type = type;
    if (status) filters.status = status;
    
    req.query = { ...req.query, ...filters };
    await DeviceController.getAllDevices(req, res);
  } catch (error) {
    next(error);
  }
});

// GET /api/devices/:id - Get specific device by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Device ID is required' });
    }
    
    await DeviceController.getDeviceById(req, res);
  } catch (error) {
    next(error);
  }
});

// GET /api/devices/status - Get current device status
router.get('/status', async (req, res, next) => {
  try {
    await DeviceController.getDeviceStatus(req, res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
