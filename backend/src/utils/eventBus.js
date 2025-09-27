'use strict';
const EventEmitter = require('events');

/**
 * Simple event bus to decouple services and websocket broadcaster.
 * Events:
 *  - 'resource.updated' { type, id, data }
 *  - 'resource.created' { type, id, data }
 *  - 'resource.deleted' { type, id }
 *  - 'schedule.created' { id, data }
 *  - 'schedule.updated' { id, data }
 *  - 'schedule.deleted' { id }
 *  - 'device.status' { id, status, meta }
 */
// PUBLIC_INTERFACE
class EventBus extends EventEmitter {
  /** Event bus wraps EventEmitter for clarity and future extension */
}

const eventBus = new EventBus();

module.exports = { eventBus };
