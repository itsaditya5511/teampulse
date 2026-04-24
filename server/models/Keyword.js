const mongoose = require('mongoose');

const keywordSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  targetUrl: {
    type: String,
    required: true,
  },
  position: {
    type: Number,
    default: null,
  },
  checkedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Keyword', keywordSchema);
