const mongoose = require('mongoose');

const deploymentSchema = new mongoose.Schema({
  project: {
    type: String,
    required: true,
  },
  version: {
    type: String,
    required: true,
  },
  environment: {
    type: String,
    enum: ['dev', 'staging', 'production'],
    required: true,
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'in-progress'],
    required: true,
  },
  deployedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  notes: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Deployment', deploymentSchema);
