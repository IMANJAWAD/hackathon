const express = require('express');
const router = express.Router();
const MaintenanceController = require('../controllers/maintenanceController');

// GET /api/maintenance/tickets - Get all maintenance tickets
router.get('/tickets', async (req, res, next) => {
  try {
    const { status, severity, building } = req.query;
    
    // Build filter object
    const filters = {};
    if (status) filters.status = status;
    if (severity) filters.severity = severity;
    if (building) filters.building = building;
    
    req.query = { ...req.query, ...filters };
    await MaintenanceController.getAllTickets(req, res);
  } catch (error) {
    next(error);
  }
});

// POST /api/maintenance/tickets - Create a new maintenance ticket
router.post('/tickets', async (req, res, next) => {
  try {
    const { deviceId, building, issueType, severity, description } = req.body;
    
    // Validate required fields
    if (!deviceId || !building || !issueType) {
      return res.status(400).json({ 
        error: 'Missing required fields: deviceId, building, and issueType are required' 
      });
    }
    
    // Validate severity if provided
    if (severity && !['Low', 'Medium', 'High'].includes(severity)) {
      return res.status(400).json({
        error: 'Invalid severity. Must be one of: Low, Medium, High'
      });
    }
    
    await MaintenanceController.createTicket(req, res);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/maintenance/tickets/:id/resolve - Resolve a maintenance ticket
router.patch('/tickets/:id/resolve', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Ticket ID is required' });
    }
    
    await MaintenanceController.resolveTicket(req, res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
