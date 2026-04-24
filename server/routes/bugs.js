const express = require('express');
const router = express.Router();
const Bug = require('../models/Bug');
const User = require('../models/User');
const Notification = require('../models/Notification');
const authenticate = require('../middleware/authenticate');
const roleGuard = require('../middleware/roleGuard');

// Apply auth to all routes
router.use(authenticate);

// GET /api/bugs
router.get('/', async (req, res) => {
  try {
    const { status, priority } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    // Strict Privacy Logic: Only see if you created it, are assigned to it, or are an admin
    if (req.user.role !== 'admin') {
      filter.$or = [
        { createdBy: req.user.userId },
        { assignedTo: req.user.userId }
      ];
    }

    const bugs = await Bug.find(filter)
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });
    res.json(bugs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/bugs
router.post('/', roleGuard(['dev', 'pm', 'admin', 'seo', 'devops']), async (req, res) => {
  try {
    const { title, description, errorStack, priority, assignedTo, deadline } = req.body;
    const bug = new Bug({
      title,
      description,
      errorStack,
      priority,
      assignedTo: assignedTo || null,
      deadline: deadline || null,
      createdBy: req.user.userId,
    });
    const newBug = await bug.save();
    const populatedBug = await Bug.findById(newBug._id)
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email role');

    // Create notifications for all relevant users
    const creator = await User.findById(req.user.userId);
    const allUsers = await User.find({ _id: { $ne: req.user.userId } });

    for (const user of allUsers) {
      await Notification.create({
        recipient: user._id,
        message: `${creator.name} created a new bug: "${title}" [${priority}]`,
        type: 'bug_created',
        relatedId: newBug._id,
      });
    }

    // Extra notification for assigned user
    if (assignedTo) {
      await Notification.create({
        recipient: assignedTo,
        message: `You have been assigned to bug: "${title}"`,
        type: 'bug_assigned',
        relatedId: newBug._id,
      });
    }

    res.status(201).json(populatedBug);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/bugs/:id
router.put('/:id', roleGuard(['dev', 'pm', 'admin', 'seo', 'devops']), async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) return res.status(404).json({ message: 'Bug not found' });

    const oldStatus = bug.status;
    const oldAssignee = bug.assignedTo?.toString();
    Object.assign(bug, req.body);

    const updatedBug = await bug.save();
    const populatedBug = await Bug.findById(updatedBug._id)
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email role');

    const updater = await User.findById(req.user.userId);

    // Notify on status change
    if (req.body.status && req.body.status !== oldStatus) {
      const allUsers = await User.find({ _id: { $ne: req.user.userId } });
      for (const user of allUsers) {
        await Notification.create({
          recipient: user._id,
          message: `${updater.name} changed "${bug.title}" status: ${oldStatus} → ${req.body.status}`,
          type: 'status_change',
          relatedId: bug._id,
        });
      }
    }

    // Notify on reassignment
    if (req.body.assignedTo && req.body.assignedTo !== oldAssignee) {
      await Notification.create({
        recipient: req.body.assignedTo,
        message: `You have been assigned to bug: "${bug.title}"`,
        type: 'bug_assigned',
        relatedId: bug._id,
      });
    }

    res.json(populatedBug);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/bugs/:id
router.delete('/:id', roleGuard(['dev', 'pm', 'admin', 'seo', 'devops']), async (req, res) => {
  try {
    const bug = await Bug.findByIdAndDelete(req.params.id);
    if (!bug) return res.status(404).json({ message: 'Bug not found' });
    res.json({ message: 'Bug deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
