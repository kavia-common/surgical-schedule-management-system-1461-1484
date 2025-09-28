const app = require('./app');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.warn(`Server running at http://${HOST}:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.warn('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.warn('HTTP server closed');
    process.exit(0);
  });
});

module.exports = server;
