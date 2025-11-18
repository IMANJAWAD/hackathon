import axios from 'axios';
import { io } from 'socket.io-client';

// API base URL
const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Socket.IO connection
const socket = io('http://localhost:5000', {
  transports: ['websocket'],
  autoConnect: false,
});

// Socket event emitter
const socketEvents = {
  connect: () => socket.connect(),
  disconnect: () => socket.disconnect(),
  onAlert: (callback) => {
    socket.on('energyAlert', callback);
    return () => socket.off('energyAlert', callback);
  },
  onDeviceUpdate: (callback) => {
    socket.on('deviceStatus', callback);
    return () => socket.off('deviceStatus', callback);
  },
};

// API methods
const energyAPI = {
  getLiveEnergy: () => api.get('/energy/live'),
  getEnergyHistory: (building, hours) => 
    api.get(`/energy/history?building=${building}&hours=${hours}`),
  getEnergyAlerts: () => api.get('/energy/alerts'),
};

const maintenanceAPI = {
  getTickets: () => api.get('/maintenance/tickets'),
  createTicket: (ticket) => api.post('/maintenance/tickets', ticket),
  updateTicket: (id, updates) => 
    api.patch(`/maintenance/tickets/${id}`, updates),
};

const devicesAPI = {
  getDevices: () => api.get('/devices'),
  getDevice: (id) => api.get(`/devices/${id}`),
  updateDevice: (id, updates) => api.patch(`/devices/${id}`, updates),
};

const healthAPI = {
  check: () => api.get('/health'),
};

export {
  api,
  socket,
  socketEvents,
  energyAPI,
  maintenanceAPI,
  devicesAPI,
  healthAPI,
};
