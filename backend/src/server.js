require('dotenv').config();
const app = require('./app');
const { setupWebSocket } = require('./websocket');
const { testConnection } = require('./data/db');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, async () => {
  console.log(`Server running at http://${HOST}:${PORT}`);

  // Try MSSQL connection on startup; log result without crashing the server
  try {
    await testConnection();
    console.log('MSSQL: Connection successful.');
  } catch (err) {
    // Non-fatal: service may still run with in-memory store until DB configured
    console.warn('MSSQL: Connection failed. Running with in-memory data store.');
    console.warn(`Reason: ${err.message}`);
  }
});

// Setup WebSocket on same server
const wss = setupWebSocket(server);

// Simple help endpoint for WS usage
app.get('/ws-info', (req, res) => {
  res.json({
    note: 'Connect to WebSocket at ws://<host>/ws to receive real-time updates.',
    events: [
      'resource.created', 'resource.updated', 'resource.deleted',
      'schedule.created', 'schedule.updated', 'schedule.deleted',
      'device.status',
    ],
    pingExample: { type: 'ping' },
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    try { wss.close(); } catch (e) {}
    process.exit(0);
  });
});

module.exports = server;
