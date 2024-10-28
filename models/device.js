const mongoose = require('mongoose');
const { DataTypes, Units } = require('../constants/dataTypes');

const deviceSchema = new mongoose.Schema({
  serialNumber: { type: String, unique: true },
  manufacturer: String,
  modelNumber: String,
  type: {
    type: String,
    enum: ['HeatingElement', 'TemperatureProbe', 'Pump', 'Valve'],
    required: true,
  },
  name: String,
  location: String,
  dataType: {
    type: String,
    enum: Object.values(DataTypes),
    required: true,
  },
  unit: {
    type: String,
    enum: Object.values(Units),
    required: true,
  },
});

module.exports = mongoose.model('Device', deviceSchema);