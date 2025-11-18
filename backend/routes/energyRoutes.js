const express = require('express');
const router = express.Router();
const EnergyController = require('../controllers/energyController');

// GET /api/energy/live - Get latest energy readings for all buildings
router.get('/live', async (req, res, next) => {
  try {
    const data = await EnergyController.getLiveEnergy(req, res);
    // Response is already sent by the controller
  } catch (error) {
    next(error);
  }
});

// GET /api/energy/history/:building - Get historical energy data
router.get('/history/:building', async (req, res, next) => {
  try {
    const { building } = req.params;
    const { hours = '24' } = req.query;
    
    // Validate building parameter
    if (!building) {
      return res.status(400).json({ error: 'Building parameter is required' });
    }
    
    // Validate hours parameter
    const hoursNum = parseInt(hours, 10);
    if (isNaN(hoursNum) || hoursNum < 1 || hoursNum > 720) { // Max 30 days
      return res.status(400).json({ error: 'Hours must be a number between 1 and 720' });
    }
    
    req.params.hours = hoursNum;
    await EnergyController.getEnergyHistory(req, res);
  } catch (error) {
    next(error);
  }
});

// GET /api/energy/alerts - Get current energy alerts
router.get('/alerts', async (req, res, next) => {
  try {
    await EnergyController.getEnergyAlerts(req, res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
