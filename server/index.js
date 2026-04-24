require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');

// Route imports
const authRoutes = require('./routes/auth');
const bugRoutes = require('./routes/bugs');
const deploymentRoutes = require('./routes/deployments');
const apihealthRoutes = require('./routes/apihealth');
const seoRoutes = require('./routes/seo');
const notificationRoutes = require('./routes/notifications');
const deploymentRequestRoutes = require('./routes/deploymentRequests');

// Service imports
const { pingAllEndpoints } = require('./services/pingService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bugs', bugRoutes);
app.use('/api/deployments', deploymentRoutes);
app.use('/api/apihealth', apihealthRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/deployments', deploymentRequestRoutes); // Note: this prefix overlaps with old deployments? let's check.

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/teampulse')
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 TeamPulse server running on port ${PORT}`);
    });

    // Cron: Ping API endpoints every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      console.log('🔄 Running API health ping...');
      try {
        await pingAllEndpoints();
      } catch (err) {
        console.error('Ping cron error:', err.message);
      }
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

module.exports = app;
