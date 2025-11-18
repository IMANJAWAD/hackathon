const EnergyLog = require('../models/EnergyLog');
const Device = require('../models/Device');
const MaintenanceTicket = require('../models/MaintenanceTicket');

class SimulationService {
    constructor(io) {
        this.io = io;
        this.isSimulating = false;
        this.energyIntervals = new Map();
        this.deviceIntervals = new Map();
        
        // Campus buildings for simulation
        this.buildings = ['Block A', 'Block B', 'Library', 'Lab Complex'];
        
        // Device types for each building
        this.deviceTypes = ['AC Unit', 'Generator', 'Elevator', 'Lighting Panel', 'Water Heater'];
        
        // Track simulated devices
        this.simulatedDevices = [];
        
        // Energy thresholds (kWh)
        this.energyThresholds = {
            normal: 60,
            warning: 80,
            critical: 100
        };
        
        // Device thresholds
        this.deviceThresholds = {
            overheating: 50,        // °C
            criticalTemp: 70,       // °C
            criticalHealth: 30,     // %
            warningHealth: 40       // %
        };
    }

    // Initialize the simulation with sample devices
    async initializeSimulation() {
        console.log('🔄 Initializing simulation data...');
        
        try {
            // Clear existing simulation data (optional - for clean restarts)
            await this.cleanupPreviousSimulation();
            
            // Create simulated devices for each building
            await this.initializeDevices();
            
            console.log(`✅ Simulation initialized with ${this.simulatedDevices.length} devices across ${this.buildings.length} buildings`);
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize simulation:', error);
            return false;
        }
    }

    // Start all simulations
    async startSimulation() {
        if (this.isSimulating) {
            console.log('⚠️ Simulation is already running');
            return;
        }

        console.log('🚀 Starting Smart Campus simulation...');
        this.isSimulating = true;

        // Start energy simulation for each building
        this.startEnergySimulation();
        
        // Start device simulation
        this.startDeviceSimulation();
        
        console.log('✅ All simulations started successfully');
    }

    // Stop all simulations
    async stopSimulation() {
        console.log('🛑 Stopping simulation...');
        this.isSimulating = false;

        // Clear energy intervals
        this.energyIntervals.forEach((interval, building) => {
            clearInterval(interval);
            console.log(`⏹️ Stopped energy simulation for ${building}`);
        });
        this.energyIntervals.clear();

        // Clear device intervals
        this.deviceIntervals.forEach((interval, deviceId) => {
            clearInterval(interval);
        });
        this.deviceIntervals.clear();

        console.log('✅ All simulations stopped');
    }

    // ENERGY SIMULATION METHODS

    startEnergySimulation() {
        console.log('💡 Starting energy simulation...');

        this.buildings.forEach(building => {
            const interval = setInterval(async () => {
                if (!this.isSimulating) return;
                
                try {
                    await this.simulateEnergyReading(building);
                } catch (error) {
                    console.error(`Error in energy simulation for ${building}:`, error);
                }
            }, 5000); // Every 5 seconds

            this.energyIntervals.set(building, interval);
        });

        console.log(`✅ Energy simulation started for ${this.buildings.length} buildings`);
    }

    async simulateEnergyReading(building) {
        // Generate realistic energy values
        const voltage = 210 + Math.random() * 30; // 210-240V
        const current = this.generateRealisticCurrent(building);
        const powerConsumption = (voltage * current) / 1000; // kWh
        
        // Determine alert status
        const alertStatus = this.calculateAlertStatus(powerConsumption);

        // Create energy log
        const energyLog = new EnergyLog({
            building: building,
            voltage: parseFloat(voltage.toFixed(2)),
            current: parseFloat(current.toFixed(2)),
            powerConsumption: parseFloat(powerConsumption.toFixed(2)),
            alertStatus: alertStatus
        });

        await energyLog.save();

        // Emit real-time updates
        this.emitEnergyUpdate(building, powerConsumption, alertStatus);
        
        // Create maintenance ticket for critical energy issues
        if (alertStatus === 'critical') {
            await this.createEnergyMaintenanceTicket(building, powerConsumption);
        }

        console.log(`⚡ ${building}: ${powerConsumption.toFixed(2)} kWh (${alertStatus})`);
    }

    // DEVICE SIMULATION METHODS

    async startDeviceSimulation() {
        console.log('🔧 Starting device simulation...');

        // Load devices from database
        const devices = await Device.find({});
        this.simulatedDevices = devices;

        devices.forEach(device => {
            const interval = setInterval(async () => {
                if (!this.isSimulating) return;
                
                try {
                    await this.simulateDeviceMetrics(device);
                } catch (error) {
                    console.error(`Error in device simulation for ${device.deviceId}:`, error);
                }
            }, 5000); // Every 5 seconds

            this.deviceIntervals.set(device.deviceId, interval);
        });

        console.log(`✅ Device simulation started for ${devices.length} devices`);
    }

    async simulateDeviceMetrics(device) {
        // Simulate realistic device metrics
        const newTemperature = this.generateRealisticTemperature(device);
        const newHealth = this.calculateDeviceHealth(device.health, device.temperature);
        const newStatus = this.calculateDeviceStatus(newHealth, newTemperature);

        // Update device
        device.temperature = parseFloat(newTemperature.toFixed(1));
        device.health = parseFloat(newHealth.toFixed(1));
        device.status = newStatus;
        device.lastUpdated = new Date();

        await device.save();

        // Check for maintenance needs
        await this.checkDeviceMaintenance(device);

        // Emit real-time updates
        this.emitDeviceUpdate(device);

        console.log(`🔧 ${device.deviceId}: ${newHealth.toFixed(1)}% health, ${newTemperature.toFixed(1)}°C (${newStatus})`);
    }

    // MAINTENANCE AUTOMATION METHODS

    async checkDeviceMaintenance(device) {
        const issues = [];

        // Check for overheating
        if (device.temperature > this.deviceThresholds.overheating) {
            issues.push({
                type: 'Overheating',
                severity: device.temperature > this.deviceThresholds.criticalTemp ? 'High' : 'Medium',
                message: `Device temperature critical: ${device.temperature.toFixed(1)}°C` 
            });
        }

        // Check for poor health
        if (device.health < this.deviceThresholds.warningHealth) {
            issues.push({
                type: 'Low Health',
                severity: device.health < this.deviceThresholds.criticalHealth ? 'High' : 'Medium',
                message: `Device health low: ${device.health.toFixed(1)}%` 
            });
        }

        // Create tickets for detected issues
        for (const issue of issues) {
            await this.createDeviceMaintenanceTicket(device, issue);
        }
    }

    async createDeviceMaintenanceTicket(device, issue) {
        try {
            // Check for existing similar pending tickets
            const existingTicket = await MaintenanceTicket.findOne({
                deviceId: device.deviceId,
                issueType: issue.type,
                status: 'Pending'
            });

            if (existingTicket) {
                return existingTicket; // Ticket already exists
            }

            const ticket = new MaintenanceTicket({
                deviceId: device.deviceId,
                building: device.building,
                issueType: issue.type,
                severity: issue.severity,
                description: issue.message
            });

            await ticket.save();

            // Emit real-time notification
            this.emitMaintenanceTicket(ticket);

            console.log(`🎫 Created maintenance ticket: ${ticket.ticketId} for ${device.deviceId} - ${issue.type}`);
            return ticket;
        } catch (error) {
            console.error('Failed to create maintenance ticket:', error);
        }
    }

    async createEnergyMaintenanceTicket(building, powerConsumption) {
        try {
            const ticket = new MaintenanceTicket({
                building: building,
                issueType: 'Energy Overload',
                severity: 'High',
                description: `Critical energy consumption detected: ${powerConsumption.toFixed(2)} kWh` 
            });

            await ticket.save();
            this.emitMaintenanceTicket(ticket);
            
            console.log(`🎫 Created energy maintenance ticket: ${ticket.ticketId} for ${building}`);
            return ticket;
        } catch (error) {
            console.error('Failed to create energy maintenance ticket:', error);
        }
    }

    // HELPER METHODS

    generateRealisticCurrent(building) {
        // Different buildings have different base energy consumption patterns
        const baseCurrents = {
            'Lab Complex': 3 + Math.random() * 7,    // Higher usage
            'Block A': 2 + Math.random() * 5,        // Medium usage  
            'Block B': 2 + Math.random() * 5,        // Medium usage
            'Library': 1 + Math.random() * 4         // Lower usage
        };
        
        // Add some randomness and occasional spikes
        let current = baseCurrents[building] || 2 + Math.random() * 4;
        
        // 10% chance of energy spike
        if (Math.random() < 0.1) {
            current *= 1.5 + Math.random(); // 50-100% increase
        }
        
        return Math.min(current, 10); // Cap at 10A
    }

    generateRealisticTemperature(device) {
        let baseTemp = 25; // Base temperature
        
        // Different device types run at different temperatures
        const deviceTempModifiers = {
            'AC Unit': -5,      // Cooler
            'Generator': 15,    // Hotter
            'Water Heater': 20, // Very hot
            'Elevator': 5,      // Slightly warm
            'Lighting Panel': 0 // Normal
        };
        
        baseTemp += deviceTempModifiers[device.type] || 0;
        
        // Add some fluctuation
        baseTemp += (Math.random() - 0.5) * 10;
        
        // Occasional overheating (5% chance)
        if (Math.random() < 0.05) {
            baseTemp += 20 + Math.random() * 15;
        }
        
        return Math.max(20, Math.min(baseTemp, 85)); // Keep between 20-85°C
    }

    calculateDeviceHealth(currentHealth, temperature) {
        let healthChange = (Math.random() - 0.3) * 2; // Slight degradation bias
        
        // Temperature affects health degradation
        if (temperature > 50) {
            healthChange -= (temperature - 50) * 0.1; // Faster degradation when hot
        }
        
        // Occasional maintenance improvements (2% chance)
        if (Math.random() < 0.02) {
            healthChange += 10 + Math.random() * 20; // Significant improvement
        }
        
        const newHealth = currentHealth + healthChange;
        return Math.max(0, Math.min(100, newHealth)); // Clamp between 0-100
    }

    calculateDeviceStatus(health, temperature) {
        if (health < 30 || temperature > 70) return 'Faulty';
        if (health < 60 || temperature > 50) return 'Warning';
        return 'OK';
    }

    calculateAlertStatus(powerConsumption) {
        if (powerConsumption > this.energyThresholds.critical) return 'critical';
        if (powerConsumption > this.energyThresholds.warning) return 'warning';
        return 'normal';
    }

    // SOCKET.IO EMITTER METHODS

    emitEnergyUpdate(building, powerConsumption, alertStatus) {
        if (!this.io) return;
        
        this.io.emit('energyUpdate', {
            building: building,
            usage: powerConsumption,
            alertStatus: alertStatus,
            timestamp: new Date()
        });

        if (alertStatus !== 'normal') {
            this.io.emit('energyAlert', {
                building: building,
                usage: powerConsumption,
                level: alertStatus,
                timestamp: new Date(),
                message: `${alertStatus.toUpperCase()} energy consumption in ${building}: ${powerConsumption.toFixed(2)} kWh` 
            });
        }
    }

    emitDeviceUpdate(device) {
        if (!this.io) return;
        
        this.io.emit('deviceStatus', {
            deviceId: device.deviceId,
            building: device.building,
            type: device.type,
            temperature: device.temperature,
            health: device.health,
            status: device.status,
            lastUpdated: device.lastUpdated
        });
    }

    emitMaintenanceTicket(ticket) {
        if (!this.io) return;
        
        this.io.emit('maintenanceTicket', {
            ticketId: ticket.ticketId,
            deviceId: ticket.deviceId,
            building: ticket.building,
            issueType: ticket.issueType,
            severity: ticket.severity,
            status: ticket.status,
            generatedAt: ticket.generatedAt
        });
    }

    // INITIALIZATION HELPERS

    async initializeDevices() {
        for (const building of this.buildings) {
            for (let i = 0; i < 3; i++) {
                const deviceType = this.deviceTypes[i % this.deviceTypes.length];
                const deviceId = `${deviceType.replace(' ', '')}-${building.replace(' ', '')}-${i + 1}`;
                
                // Check if device already exists
                const existingDevice = await Device.findOne({ deviceId });
                if (!existingDevice) {
                    const device = new Device({
                        deviceId: deviceId,
                        name: `${deviceType} ${i + 1}`,
                        building: building,
                        type: deviceType,
                        temperature: 25 + Math.random() * 15,
                        health: 70 + Math.random() * 25,
                        status: 'OK',
                        lastUpdated: new Date()
                    });
                    
                    await device.save();
                    this.simulatedDevices.push(device);
                }
            }
        }
    }

    async cleanupPreviousSimulation() {
        // Optional: Clean up previous simulation data
        // await EnergyLog.deleteMany({});
        // await MaintenanceTicket.deleteMany({ status: 'Pending' });
    }

    // STATUS METHODS

    getSimulationStatus() {
        return {
            isSimulating: this.isSimulating,
            buildings: this.buildings.length,
            devices: this.simulatedDevices.length,
            energyIntervals: this.energyIntervals.size,
            deviceIntervals: this.deviceIntervals.size
        };
    }
}

module.exports = SimulationService;
