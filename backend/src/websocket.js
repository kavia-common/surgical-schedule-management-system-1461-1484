'use strict';
const WebSocket = require('ws');
const { eventBus } = require('./utils/eventBus');

/**
  WebSocket broadcaster:
  - Subscribes to global eventBus and forwards events to clients.
  - Clients can optionally send a ping or subscribe message in future extensions.
 */
// PUBLIC_INTERFACE
function setupWebSocket(httpServer) {
  /** Attach WebSocket server to an existing HTTP server */
  const wss = new WebSocket.Server({ server: httpServer, path: '/ws' });

  function broadcast(type, payload) {
    const message = JSON.stringify({ type, payload, ts: new Date().toISOString() });
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // Forward internal events
  eventBus.on('resource.created', (p) => broadcast('resource.created', p));
  eventBus.on('resource.updated', (p) => broadcast('resource.updated', p));
  eventBus.on('resource.deleted', (p) => broadcast('resource.deleted', p));
  eventBus.on('schedule.created', (p) => broadcast('schedule.created', p));
  eventBus.on('schedule.updated', (p) => broadcast('schedule.updated', p));
  eventBus.on('schedule.deleted', (p) => broadcast('schedule.deleted', p));
  eventBus.on('device.status', (p) => broadcast('device.status', p));

  wss.on('connection', (ws) => {
    ws.on('message', (raw) => {
      // For now, support ping/echo
      try {
        const msg = JSON.parse(raw.toString());
        if (msg.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong', ts: new Date().toISOString() }));
        }
      } catch (_) {
        // ignore malformed messages
      }
    });
    ws.send(JSON.stringify({ type: 'welcome', payload: { message: 'Connected to Surgical Schedule WS' } }));
  });

  return wss;
}

module.exports = { setupWebSocket };
