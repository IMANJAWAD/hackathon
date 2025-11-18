const mongoose = require('mongoose');

const maintenanceTicketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    unique: true,
    default: () => `TKT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
  },
  deviceId: {
    type: String,
    ref: 'Device',
    required: true
  },
  building: {
    type: String,
    required: true,
    enum: ['Block A', 'Block B', 'Library', 'Lab Complex']
  },
  issueType: {
    type: String,
    required: true,
    enum: ['Overheating', 'Low Health', 'Energy Overload', 'Other']
  },
  severity: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending'
  },
  description: {
    type: String,
    required: false
  },
  resolvedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// Indexes for faster queries
maintenanceTicketSchema.index({ status: 1 });
maintenanceTicketSchema.index({ severity: 1 });
maintenanceTicketSchema.index({ building: 1 });

// Pre-save hook to set resolvedAt timestamp
maintenanceTicketSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'Resolved' && !this.resolvedAt) {
    this.resolvedAt = new Date();
  }
  next();
});

const MaintenanceTicket = mongoose.model('MaintenanceTicket', maintenanceTicketSchema);

module.exports = MaintenanceTicket;
