const mongoose = require('mongoose');
const Device = require('../models/device');
const {DataTypes, Units} = require("../constants/dataTypes");
require('dotenv').config();

const devices = [
  // Heating elements
  {
    serialNumber: 'HE-001',
    manufacturer: 'Blichmann',
    modelNumber: 'BoilCoil',
    type: 'HeatingElement',
    name: 'HTL',
    dataType: DataTypes.STATE,
    unit: Units.BOOLEAN,
  },
  {
    serialNumber: 'HE-002',
    manufacturer: 'Blichmann',
    modelNumber: 'BoilCoil',
    type: 'HeatingElement',
    name: 'Boil',
    dataType: DataTypes.STATE,
    unit: Units.BOOLEAN,
  },
  // Pumps
  {
    serialNumber: 'VV378638',
    manufacturer: 'March Pump',
    modelNumber: 'Assy 809-PL-HS',
    type: 'Pump',
    name: 'Pump 1',
    location: 'HLT Pump',
    dataType: DataTypes.STATE,
    unit: Units.BOOLEAN,
  },
  {
    serialNumber: 'VV378636',
    manufacturer: 'March Pump',
    modelNumber: 'Assy 809-PL-HS',
    type: 'Pump',
    location: 'Mash Pump',
    name: 'Pump 2',
    dataType: DataTypes.STATE,
    unit: Units.BOOLEAN,
  },
  {
    serialNumber: 'VV378633',
    manufacturer: 'March Pump',
    modelNumber: 'Assy 809-PL-HS',
    type: 'Pump',
    location: 'Boil Pump',
    name: 'Pump 3',
    dataType: DataTypes.STATE,
    unit: Units.BOOLEAN,
  },
  // Valves
  {
    serialNumber: '1408T1562N10-01',
    manufacturer: 'Tonhe',
    modelNumber: 'A20-T15-S2-B',
    type: 'Valve',
    name: 'Valve 1',
    dataType: DataTypes.STATE,
    unit: Units.BOOLEAN,
  },
  {
    serialNumber: '1408T1562N10-02',
    manufacturer: 'Tonhe',
    modelNumber: 'A20-T15-S2-B',
    type: 'Valve',
    name: 'Valve 2',
    dataType: DataTypes.STATE,
    unit: Units.BOOLEAN,
  },
  {
    serialNumber: '1408T1562N10-03',
    manufacturer: 'Tonhe',
    modelNumber: 'A20-T15-S2-B',
    type: 'Valve',
    name: 'Valve 3',
    dataType: DataTypes.STATE,
    unit: Units.BOOLEAN,
  },
  {
    serialNumber: '1408T1562N10-04',
    manufacturer: 'Tonhe',
    modelNumber: 'A20-T15-S2-B',
    type: 'Valve',
    name: 'Valve 4',
    dataType: DataTypes.STATE,
    unit: Units.BOOLEAN,
  },
  {
    serialNumber: '1408T1562N10-05',
    manufacturer: 'Tonhe',
    modelNumber: 'A20-T15-S2-B',
    type: 'Valve',
    name: 'Valve 5',
    dataType: DataTypes.STATE,
    unit: Units.BOOLEAN,
  },
  {
    serialNumber: '1408T1562N10-06',
    manufacturer: 'Tonhe',
    modelNumber: 'A20-T15-S2-B',
    type: 'Valve',
    name: 'Valve 6',
    dataType: DataTypes.STATE,
    unit: Units.BOOLEAN,
  },
  {
    serialNumber: '1408T1562N10-07',
    manufacturer: 'Tonhe',
    modelNumber: 'A20-T15-S2-B',
    type: 'Valve',
    name: 'Valve 7',
    dataType: DataTypes.STATE,
    unit: Units.BOOLEAN,
  },
  {
    serialNumber: '1408T1562N10-08',
    manufacturer: 'Tonhe',
    modelNumber: 'A20-T15-S2-B',
    type: 'Valve',
    name: 'Valve 8',
    dataType: DataTypes.STATE,
    unit: Units.BOOLEAN,
  },
  // Temperature
  {
    serialNumber: 'TMP-001',
    manufacturer: 'Dallas',
    modelNumber: 'DS18B20',
    type: 'TemperatureProbe',
    name: 'HLT Temperature',
    location: 'HLT',
    dataType: DataTypes.TEMPERATURE,
    unit: Units.CELSIUS,
  },
  {
    serialNumber: 'TMP-002',
    manufacturer: 'Dallas',
    modelNumber: 'DS18B20',
    type: 'TemperatureProbe',
    name: 'Mash Out Temperature',
    location: 'Mash Out',
    dataType: DataTypes.TEMPERATURE,
    unit: Units.CELSIUS,
  },
  {
    serialNumber: 'TMP-003',
    manufacturer: 'Dallas',
    modelNumber: 'DS18B20',
    type: 'TemperatureProbe',
    name: 'Kettle In Temperature',
    location: 'Chill out boil in',
    dataType: DataTypes.TEMPERATURE,
    unit: Units.CELSIUS,
  },
  {
    serialNumber: 'TMP-004',
    manufacturer: 'Dallas',
    modelNumber: 'DS18B20',
    type: 'TemperatureProbe',
    name: 'Kettle Temperature',
    location: 'Boil Kettle',
    dataType: DataTypes.TEMPERATURE,
    unit: Units.CELSIUS,
  },
  {
    serialNumber: 'TMP-005',
    manufacturer: 'Dallas',
    modelNumber: 'DS18B20',
    type: 'TemperatureProbe',
    name: 'Mash Temperature',
    location: 'Mash Kettle',
    dataType: DataTypes.TEMPERATURE,
    unit: Units.CELSIUS,
  },
  {
    serialNumber: 'HLT-T-SETPOINT',
    type: 'Setpoint',
    name: 'HLT Setpoint',
    dataType: DataTypes.TEMPERATURE,
    unit: Units.CELSIUS,
  },
  {
    serialNumber: 'MASH-T-SETPOINT',
    type: 'Setpoint',
    name: 'Mash Setpoint',
    dataType: DataTypes.TEMPERATURE,
    unit: Units.CELSIUS,
  },
  {
    serialNumber: 'KETTLE-T-SETPOINT',
    type: 'Setpoint',
    name: 'Kettle Setpoint',
    dataType: DataTypes.TEMPERATURE,
    unit: Units.CELSIUS,
  },
  {
    serialNumber: 'HLT_VOLUME',
    type: 'PressureSensor',
    name: 'HLT Volume',
    dataType: DataTypes.VOLUME,
    unit: Units.LITERS,
  }
];

async function initializeDevices() {
  await mongoose.connect(process.env.MONGO_URI);

  if (await Device.countDocuments() > 0) {
    console.log('Devices already initialized.');
    return;
  }

  for (const deviceData of devices) {
    const device = new Device(deviceData);
    await device.save();
  }

  console.log('Devices initialized.');
}

initializeDevices().catch((error) => {
  console.error('Error initializing devices:', error);
});

module.exports = { devices };