require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Bug = require('./models/Bug');
const Deployment = require('./models/Deployment');
const APIEndpoint = require('./models/APIEndpoint');
const SEOReport = require('./models/SEOReport');
const Keyword = require('./models/Keyword');
const Notification = require('./models/Notification');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/teampulse');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Bug.deleteMany({}),
      Deployment.deleteMany({}),
      APIEndpoint.deleteMany({}),
      SEOReport.deleteMany({}),
      Keyword.deleteMany({}),
      Notification.deleteMany({})
    ]);
    console.log('Cleared existing data');

    const hashedPassword = await bcrypt.hash("12345678", 10);

    // Create 4 Users (+ PM)
    const users = await User.insertMany([
      { name: 'Dev User', email: 'dev@teampulse.com', password: hashedPassword, role: 'dev' },
      { name: 'DevOps User', email: 'devops@teampulse.com', password: hashedPassword, role: 'devops' },
      { name: 'SEO User', email: 'seo@teampulse.com', password: hashedPassword, role: 'seo' },
      { name: 'Project Manager', email: 'pm@teampulse.com', password: hashedPassword, role: 'pm' },
    ]);
    const [devUser, opsUser, seoUser, pmUser] = users;
    console.log('Created Users');

    // Create 5 Bugs (some created by PM)
    const bugs = await Bug.insertMany([
      { title: 'Login Page Crash', description: 'App crashes when submitting invalid credentials', errorStack: 'TypeError: Cannot read properties of undefined', status: 'open', priority: 'high', assignedTo: devUser._id, createdBy: pmUser._id, deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
      { title: 'Sidebar not responsive', description: 'Hamburger menu does not appear on mobile', status: 'open', priority: 'medium', assignedTo: devUser._id, createdBy: pmUser._id, deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      { title: 'Missing API Key in prod', description: 'External API failing due to missing key', status: 'open', priority: 'critical', assignedTo: opsUser._id, createdBy: pmUser._id, deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) },
      { title: 'Typo in Dashboard', description: 'Word Analytics is spelled wrongly', status: 'resolved', priority: 'low', createdBy: seoUser._id },
      { title: 'Infinite loop in feed', description: 'Feed infinite re-render on load', status: 'resolved', priority: 'high', assignedTo: devUser._id, createdBy: devUser._id }
    ]);
    console.log('Created Bugs');

    // Create sample notifications
    await Notification.insertMany([
      { recipient: devUser._id, message: 'Project Manager assigned you to "Login Page Crash"', type: 'bug_assigned', relatedId: bugs[0]._id },
      { recipient: devUser._id, message: 'Project Manager created a new bug: "Sidebar not responsive" [medium]', type: 'bug_created', relatedId: bugs[1]._id },
      { recipient: opsUser._id, message: 'Project Manager assigned you to "Missing API Key in prod"', type: 'bug_assigned', relatedId: bugs[2]._id },
      { recipient: pmUser._id, message: 'SEO User created a new bug: "Typo in Dashboard" [low]', type: 'bug_created', relatedId: bugs[3]._id },
      { recipient: pmUser._id, message: 'Dev User resolved bug: "Infinite loop in feed"', type: 'status_change', relatedId: bugs[4]._id },
    ]);
    console.log('Created Notifications');

    // Create 5 Deployments
    await Deployment.insertMany([
      { project: 'Frontend App', version: 'v1.4.2', environment: 'production', status: 'success', deployedBy: opsUser._id },
      { project: 'Backend API', version: 'v2.1.0', environment: 'staging', status: 'failed', notes: 'Database migration failed', deployedBy: opsUser._id },
      { project: 'Auth Service', version: 'v1.0.1', environment: 'production', status: 'success', deployedBy: opsUser._id },
      { project: 'Frontend App', version: 'v1.5.0', environment: 'dev', status: 'success', deployedBy: devUser._id },
      { project: 'ML Model', version: 'v3.0', environment: 'production', status: 'in-progress', deployedBy: opsUser._id }
    ]);
    console.log('Created Deployments');

    // Create 3 API Endpoints
    await APIEndpoint.insertMany([
      { name: 'Main Auth Service', url: 'https://httpbin.org/status/200', status: 'up', responseTime: 120, uptimePercent: 99, history: [{ status: 'up', responseTime: 110 }] },
      { name: 'Payment Gateway', url: 'https://httpbin.org/delay/2', status: 'slow', responseTime: 2050, uptimePercent: 95, history: [{ status: 'slow', responseTime: 2100 }] },
      { name: 'Legacy API', url: 'https://httpbin.org/status/500', status: 'down', responseTime: 0, uptimePercent: 80, history: [{ status: 'down', responseTime: 0 }] }
    ]);
    console.log('Created API Endpoints');

    // Create 2 SEO Reports
    await SEOReport.insertMany([
      { url: 'https://teampulse.com', performanceScore: 85, seoScore: 92, accessibilityScore: 98, lcp: 1200, fid: 45, cls: 0.05 },
      { url: 'https://teampulse.com/about', performanceScore: 70, seoScore: 88, accessibilityScore: 90, lcp: 2500, fid: 120, cls: 0.15 }
    ]);
    console.log('Created SEO Reports');

    // Create 4 Tracked Keywords
    await Keyword.insertMany([
      { keyword: 'IT company dashboard', targetUrl: 'https://teampulse.com', position: 3 },
      { keyword: 'operations tool', targetUrl: 'https://teampulse.com/product', position: 1 },
      { keyword: 'DevOps management software', targetUrl: 'https://teampulse.com/devops', position: 8 },
      { keyword: 'Developer productivity tracker', targetUrl: 'https://teampulse.com/dev', position: 15 }
    ]);
    console.log('Created Keywords');

    console.log('✅ Seeding Complete!');
    process.exit(0);

  } catch (err) {
    console.error('Error seeding DB:', err);
    process.exit(1);
  }
};

seedDB();
