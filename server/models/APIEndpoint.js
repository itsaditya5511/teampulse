const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  responseTime: Number,
  status: String,
}, { _id: false });

const apiEndpointSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  lastChecked: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['up', 'down', 'slow', 'unknown'],
    default: 'unknown',
  },
  responseTime: {
    type: Number,
  },
  uptimePercent: {
    type: Number,
    default: 100,
  },
  history: [historySchema],
});

module.exports = mongoose.model('APIEndpoint', apiEndpointSchema);
