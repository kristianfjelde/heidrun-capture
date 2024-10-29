const mongoose = require('mongoose');
const { DataTypes, Units } = require('../constants/dataTypes');

const deviceStateSchema = new mongoose.Schema({
  time: { type: Date, default: Date.now },
  value: Number,
  unit: String,
  dataType: String,
}, {
  _id: false,
});


const deviceSchema = new mongoose.Schema({
  serialNumber: { type: String, unique: true },
  manufacturer: String,
  modelNumber: String,
  type: {
    type: String,
    enum: ['HeatingElement', 'TemperatureProbe', 'Pump', 'Valve', 'Setpoint'],
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
  state: deviceStateSchema
});

module.exports = mongoose.model('Device', deviceSchema);