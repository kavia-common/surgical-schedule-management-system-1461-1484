const app = require('./app');
const { setupWebSocket } = require('./websocket');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
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
