const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
  device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  time: { type: Date, default: Date.now },
  value: Number,
  unit: String,
  dataType: String,
}, {
  collection: 'readings',
  timeseries: {
    timeField: 'time',
    metaField: 'meta',
    granularity: 'minutes',
  },
});

module.exports = mongoose.model('Reading', readingSchema);