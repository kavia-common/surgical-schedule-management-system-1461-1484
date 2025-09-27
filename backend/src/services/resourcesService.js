'use strict';
const { db, list, get, create, update, remove } = require('../data/store');
const { eventBus } = require('../utils/eventBus');

// PUBLIC_INTERFACE
function listResources(type) {
  /** List resources by type: 'doctors'|'nurses'|'rooms'|'devices' */
  switch (type) {
    case 'doctors': return list(db.doctors);
    case 'nurses': return list(db.nurses);
    case 'rooms': return list(db.rooms);
    case 'devices': return list(db.devices);
    default: return [];
  }
}

// PUBLIC_INTERFACE
function getResource(type, id) {
  /** Get resource by type and id */
  const map = db[type];
  if (!map) return null;
  return get(map, id);
}

// PUBLIC_INTERFACE
function createResource(type, payload) {
  /** Create resource and emit event */
  const map = db[type];
  if (!map) return null;
  const saved = create(map, payload);
  eventBus.emit('resource.created', { type, id: saved.id, data: saved });
  return saved;
}

// PUBLIC_INTERFACE
function updateResource(type, id, patch) {
  /** Update resource and emit event */
  const map = db[type];
  if (!map) return null;
  const saved = update(map, id, patch);
  if (saved) eventBus.emit('resource.updated', { type, id, data: saved });
  return saved;
}

// PUBLIC_INTERFACE
function deleteResource(type, id) {
  /** Delete resource and emit event */
  const map = db[type];
  if (!map) return false;
  const ok = remove(map, id);
  if (ok) eventBus.emit('resource.deleted', { type, id });
  return ok;
}

// PUBLIC_INTERFACE
function setDeviceStatus(id, status, meta) {
  /** Update device status and emit device.status event */
  const dev = db.devices.get(id);
  if (!dev) return null;
  const updated = { ...dev, status, meta: { ...(dev.meta || {}), ...(meta || {}) } };
  db.devices.set(id, updated);
  eventBus.emit('device.status', { id, status: updated.status, meta: updated.meta, data: updated });
  return updated;
}

module.exports = {
  listResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
  setDeviceStatus,
};
