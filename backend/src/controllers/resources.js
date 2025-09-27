'use strict';
const {
  listResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
  setDeviceStatus,
} = require('../services/resourcesService');
const { validateDoctor, validateRoom } = require('../models/availability');

/**
 * Resources Controller: doctors, nurses, rooms, devices
 */
class ResourcesController {
  // PUBLIC_INTERFACE
  list(req, res) {
    /** List resources by type */
    const { type } = req.params;
    const data = listResources(type);
    if (!data) return res.status(400).json({ error: 'Invalid resource type' });
    return res.json({ data });
  }

  // PUBLIC_INTERFACE
  get(req, res) {
    /** Get resource by type and id */
    const { type, id } = req.params;
    const data = getResource(type, id);
    if (!data) return res.status(404).json({ error: 'Not found' });
    return res.json({ data });
  }

  // PUBLIC_INTERFACE
  create(req, res) {
    /** Create new resource */
    const { type } = req.params;
    const payload = req.body || {};

    // minimal validation for doctor/room
    if (type === 'doctors') {
      const { ok, errors, value } = validateDoctor(payload);
      if (!ok) return res.status(400).json({ error: errors.join(', ') });
      const saved = createResource(type, value);
      return res.status(201).json({ data: saved });
    }
    if (type === 'rooms') {
      const { ok, errors, value } = validateRoom(payload);
      if (!ok) return res.status(400).json({ error: errors.join(', ') });
      const saved = createResource(type, value);
      return res.status(201).json({ data: saved });
    }

    const saved = createResource(type, payload);
    if (!saved) return res.status(400).json({ error: 'Invalid resource type' });
    return res.status(201).json({ data: saved });
  }

  // PUBLIC_INTERFACE
  update(req, res) {
    /** Update resource */
    const { type, id } = req.params;
    const payload = req.body || {};

    let patch = payload;
    if (type === 'doctors') {
      const { value } = validateDoctor({ ...payload }); // lenient for patch
      patch = value;
    } else if (type === 'rooms') {
      const { value } = validateRoom({ ...payload });
      patch = value;
    }

    const saved = updateResource(type, id, patch);
    if (!saved) return res.status(404).json({ error: 'Not found' });
    return res.json({ data: saved });
  }

  // PUBLIC_INTERFACE
  delete(req, res) {
    /** Delete resource */
    const { type, id } = req.params;
    const ok = deleteResource(type, id);
    if (!ok) return res.status(404).json({ error: 'Not found' });
    return res.status(204).send();
  }

  // PUBLIC_INTERFACE
  updateDeviceStatus(req, res) {
    /** Update device status and meta */
    const { id } = req.params;
    const { status, meta } = req.body || {};
    if (!status) return res.status(400).json({ error: 'status is required' });
    const saved = setDeviceStatus(id, status, meta);
    if (!saved) return res.status(404).json({ error: 'Device not found' });
    return res.json({ data: saved });
  }
}

module.exports = new ResourcesController();
