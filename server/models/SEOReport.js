const mongoose = require('mongoose');

const seoReportSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  performanceScore: Number,
  seoScore: Number,
  accessibilityScore: Number,
  lcp: Number, // ms
  fid: Number, // ms
  cls: Number,
  aiSuggestions: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SEOReport', seoReportSchema);
