const express = require('express');
const router = express.Router();
const Bug = require('../models/Bug');
const User = require('../models/User');
const Notification = require('../models/Notification');
const authenticate = require('../middleware/authenticate');
const roleGuard = require('../middleware/roleGuard');

router.use(authenticate);

// POST /api/deployments/request/:bugId
router.post('/request/:bugId', roleGuard(['dev', 'admin']), async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.bugId);
    if (!bug) return res.status(404).json({ message: 'Bug not found' });

    const requester = await User.findById(req.user.userId);
    
    // Find all DevOps users to notify
    const devOpsUsers = await User.find({ role: 'devops' });

    for (const opsUser of devOpsUsers) {
      await Notification.create({
        recipient: opsUser._id,
        message: `${requester.name} requested deployment for bug: "${bug.title}"`,
        type: 'deployment_request',
        relatedId: bug._id,
      });
    }

    res.json({ message: 'Deployment requested successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
