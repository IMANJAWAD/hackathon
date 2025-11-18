const mongoose = require('mongoose');

const energyLogSchema = new mongoose.Schema({
  building: {
    type: String,
    required: true,
    enum: ['Block A', 'Block B', 'Library', 'Lab Complex'],
    index: true
  },
  voltage: {
    type: Number,
    required: true,
    min: 0
  },
  current: {
    type: Number,
    required: true,
    min: 0
  },
  powerConsumption: {
    type: Number,
    required: true,
    min: 0
  },
  alertStatus: {
    type: String,
    enum: ['normal', 'warning', 'critical'],
    default: 'normal'
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, { timestamps: true });

// Compound index for faster queries
energyLogSchema.index({ building: 1, timestamp: -1 });

// Pre-save hook to calculate power consumption
energyLogSchema.pre('save', function(next) {
  if (this.isModified('voltage') || this.isModified('current')) {
    this.powerConsumption = (this.voltage * this.current / 1000).toFixed(2);
  }
  
  // Set alert status based on power consumption
  if (this.powerConsumption > 80) {
    this.alertStatus = 'critical';
  } else if (this.powerConsumption > 60) {
    this.alertStatus = 'warning';
  } else {
    this.alertStatus = 'normal';
  }
  
  next();
});

const EnergyLog = mongoose.model('EnergyLog', energyLogSchema);

module.exports = EnergyLog;
