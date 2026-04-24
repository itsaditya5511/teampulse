const express = require('express');
const router = express.Router();
const SEOReport = require('../models/SEOReport');
const Keyword = require('../models/Keyword');
const authenticate = require('../middleware/authenticate');
const roleGuard = require('../middleware/roleGuard');

router.use(authenticate);

// GET /api/seo/reports
router.get('/reports', async (req, res) => {
  try {
    const reports = await SEOReport.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/seo/keywords
router.get('/keywords', async (req, res) => {
  try {
    const keywords = await Keyword.find().sort({ checkedAt: -1 });
    res.json(keywords);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/seo/keywords
router.post('/keywords', roleGuard(['seo', 'admin']), async (req, res) => {
  try {
    const { keyword, targetUrl, position } = req.body;
    const newKeyword = new Keyword({ keyword, targetUrl, position });
    const savedKeyword = await newKeyword.save();
    res.status(201).json(savedKeyword);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
