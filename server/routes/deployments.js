const express = require('express');
const router = express.Router();
const Deployment = require('../models/Deployment');
const authenticate = require('../middleware/authenticate');
const roleGuard = require('../middleware/roleGuard');

router.use(authenticate);

// GET /api/deployments
router.get('/', async (req, res) => {
  try {
    const { environment, status } = req.query;
    const filter = {};
    if (environment) filter.environment = environment;
    if (status) filter.status = status;

    const deployments = await Deployment.find(filter)
      .populate('deployedBy', 'name email')
      .sort({ timestamp: -1 });
    res.json(deployments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/deployments
router.post('/', roleGuard(['devops', 'admin']), async (req, res) => {
  try {
    const { project, version, environment, status, notes } = req.body;
    const deployment = new Deployment({
      project,
      version,
      environment,
      status,
      notes,
      deployedBy: req.user.userId,
    });
    const newDeployment = await deployment.save();
    res.status(201).json(newDeployment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
