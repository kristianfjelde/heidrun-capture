const mongoose = require('mongoose');

const rawDataSchema = new mongoose.Schema({
  time: { type: Date, default: Date.now },
  data:
    {type: mongoose.Schema.Types.Mixed}
});

module.exports = mongoose.model('RawData', rawDataSchema);