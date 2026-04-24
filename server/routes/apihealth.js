const express = require('express');
const router = express.Router();
const APIEndpoint = require('../models/APIEndpoint');
const authenticate = require('../middleware/authenticate');
const roleGuard = require('../middleware/roleGuard');

// Note: Ensure the function export is mapped properly later when we build services
const pingService = require('../services/pingService'); 

router.use(authenticate);

// GET /api/apihealth
router.get('/', async (req, res) => {
  try {
    const endpoints = await APIEndpoint.find().sort({ name: 1 });
    res.json(endpoints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/apihealth
router.post('/', roleGuard(['devops', 'admin']), async (req, res) => {
  try {
    const { name, url } = req.body;
    const endpoint = new APIEndpoint({ name, url });
    const newEndpoint = await endpoint.save();
    res.status(201).json(newEndpoint);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/apihealth/ping
router.post('/ping', roleGuard(['devops', 'admin']), async (req, res) => {
  try {
    if (pingService && pingService.pingAllEndpoints) {
       await pingService.pingAllEndpoints();
       const endpoints = await APIEndpoint.find().sort({ name: 1 });
       res.json({ message: 'Ping check triggered', endpoints });
    } else {
       res.status(500).json({ message: 'Ping service not available' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
