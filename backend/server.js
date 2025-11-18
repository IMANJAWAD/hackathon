require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

// mongoose will be mocked later in the file

// Import routes
const energyRoutes = require('./routes/energyRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const deviceRoutes = require('./routes/deviceRoutes');

// Import simulation service
const SimulationService = require('./services/simulationService');

// Import controllers to set up Socket.IO
const MaintenanceController = require('./controllers/maintenanceController');
const DeviceController = require('./controllers/deviceController');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Configure CORS for both Express and Socket.IO
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

const io = socketIo(server, {
  cors: corsOptions,
  path: '/socket.io'
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Database connection - Using in-memory data for demo
console.log('🔄 Using in-memory data for demo purposes');

// Mock mongoose for in-memory data storage
const mongoose = require('mongoose');

// Override mongoose methods for in-memory usage
const originalModel = mongoose.model;
mongoose.model = function(modelName, schema) {
  return {
    find: async () => [],
    findById: async () => ({}),
    findByIdAndUpdate: async () => ({}),
    findByIdAndDelete: async () => ({}),
    create: async (data) => ({ ...data, _id: 'mock-id', save: async () => ({ ...data, _id: 'mock-id' }) }),
  };
};

// Mock connection events
mongoose.connection = {
  on: (event, callback) => {
    if (event === 'connected' || event === 'open') {
      // Simulate successful connection after a short delay
      setTimeout(() => {
        console.log('✅ Connected to in-memory data store');
        if (callback) callback();
      }, 100);
    } else if (event === 'error') {
      // Ignore errors for demo
      console.log('⚠️  In-memory store: No errors to report');
    }
  }
};

console.log('✅ Database connection configured for demo mode');

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    database: 'in-memory',
    uptime: process.uptime(),
    message: 'Using in-memory data store for demo purposes'
  });
});

// API Routes
app.use('/api/energy', energyRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/devices', deviceRoutes);

// Set up Socket.IO in controllers
MaintenanceController.setSocketIO(io);
DeviceController.setSocketIO(io);

// Initialize simulation service
const simulationService = new SimulationService(io);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Join room for specific building if needed
  socket.on('joinBuilding', (building) => {
    socket.join(`building_${building}`);
    console.log(`Client ${socket.id} joined building ${building}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Simulation control endpoints
app.post('/api/simulation/start', async (req, res) => {
  try {
    await simulationService.startSimulation();
    res.json({ 
      success: true, 
      message: 'Simulation started successfully',
      status: simulationService.getSimulationStatus()
    });
  } catch (error) {
    console.error('Failed to start simulation:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to start simulation',
      details: error.message 
    });
  }
});

app.post('/api/simulation/stop', async (req, res) => {
  try {
    await simulationService.stopSimulation();
    res.json({ 
      success: true, 
      message: 'Simulation stopped successfully',
      status: simulationService.getSimulationStatus()
    });
  } catch (error) {
    console.error('Failed to stop simulation:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to stop simulation',
      details: error.message 
    });
  }
});

app.get('/api/simulation/status', (req, res) => {
  res.json({
    success: true,
    ...simulationService.getSimulationStatus()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 5000;
// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Start the server only if we're not in test mode
if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, '0.0.0.0', async () => {
    console.log(`\n🚀 Server is running on port ${PORT}`);
    console.log(`📊 Energy API:     http://localhost:${PORT}/api/energy/live`);
    console.log(`🔧 Maintenance API: http://localhost:${PORT}/api/maintenance/tickets`);
    console.log(`📱 Devices API:    http://localhost:${PORT}/api/devices`);
    console.log(`🩺 Health check:   http://localhost:${PORT}/api/health`);
    console.log(`\n🔌 Simulation Endpoints:`);
    console.log(`   POST   http://localhost:${PORT}/api/simulation/start`);
    console.log(`   POST   http://localhost:${PORT}/api/simulation/stop`);
    console.log(`   GET    http://localhost:${PORT}/api/simulation/status\n`);
    
    // Initialize and start simulation automatically if AUTO_START_SIMULATION is true
    if (process.env.AUTO_START_SIMULATION === 'true') {
      try {
        console.log('🔄 Initializing simulation...');
        await simulationService.initializeSimulation();
        await simulationService.startSimulation();
        console.log('✅ Simulation started automatically');
      } catch (error) {
        console.error('❌ Failed to start simulation automatically:', error);
      }
    }
  });
}

// Export for testing
module.exports = { app, server, io };
