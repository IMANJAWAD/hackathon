const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  building: {
    type: String,
    required: true,
    enum: ['Block A', 'Block B', 'Library', 'Lab Complex'],
    index: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['AC', 'Generator', 'Elevator', 'Lighting', 'Server', 'Other']
  },
  location: {
    type: String,
    required: true
  },
  temperature: {
    type: Number,
    default: 25,
    min: 0,
    max: 120
  },
  health: {
    type: Number,
    default: 100,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['Online', 'Offline', 'Maintenance', 'Faulty'],
    default: 'Online'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  specifications: {
    voltage: Number,
    current: Number,
    powerRating: String
  }
}, { timestamps: true });

// Compound index for faster queries
deviceSchema.index({ building: 1, status: 1 });

// Pre-save hook to update status based on health and temperature
deviceSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  
  // Update status based on health and temperature
  if (this.health < 30 || this.temperature > 80) {
    this.status = 'Faulty';
  } else if (this.status === 'Faulty' && this.health >= 30 && this.temperature <= 80) {
    this.status = 'Online';
  }
  
  next();
});

// Static method to get devices by status
deviceSchema.statics.findByStatus = function(status) {
  return this.find({ status });
};

// Instance method to check if device needs maintenance
deviceSchema.methods.needsMaintenance = function() {
  return this.health < 40 || this.temperature > 60;
};

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
