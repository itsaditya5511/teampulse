const fetch = require('node-fetch');
const APIEndpoint = require('../models/APIEndpoint');

const pingAllEndpoints = async () => {
  const endpoints = await APIEndpoint.find();

  for (const ep of endpoints) {
    const startTime = Date.now();
    try {
      // Small timeout to avoid hanging forever
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const res = await fetch(ep.url, { method: 'GET', signal: controller.signal });
      clearTimeout(timeoutId);

      const responseTime = Date.now() - startTime;
      const status = res.ok ? 'up' : 'down';
      
      updateEndpointStatus(ep, status, responseTime);

    } catch (err) {
      updateEndpointStatus(ep, 'down', 0);
    }
  }
};

const updateEndpointStatus = async (ep, currentStatus, responseTime) => {
  // If response time is very high but still 'up', we classify as 'slow'
  let displayStatus = currentStatus;
  if (currentStatus === 'up' && responseTime > 1500) {
    displayStatus = 'slow';
  }

  ep.status = displayStatus;
  ep.responseTime = responseTime;
  ep.lastChecked = new Date();

  // Keep last 100 history items
  ep.history.unshift({
    timestamp: ep.lastChecked,
    responseTime,
    status: displayStatus
  });

  if (ep.history.length > 100) {
    ep.history = ep.history.slice(0, 100);
  }

  // Calculate uptime
  const upChecks = ep.history.filter(h => h.status === 'up' || h.status === 'slow').length;
  ep.uptimePercent = Math.round((upChecks / ep.history.length) * 100);

  await ep.save();
};

module.exports = {
  pingAllEndpoints
};
