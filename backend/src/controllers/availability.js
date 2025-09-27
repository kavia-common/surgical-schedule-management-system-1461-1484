'use strict';
const {
  listAvailableDoctors,
  listAvailableRooms,
  getAvailability,
  setAvailability,
} = require('../services/availabilityService');
const { validateDoctor, validateRoom, validateSchedule } = require('../models/availability');

class AvailabilityController {
  // PUBLIC_INTERFACE
  listAvailable(req, res) {
    /** List available doctors or rooms within a window (?startISO=&endISO=). If no window, use "now". */
    const { type } = req.params;
    const { startISO, endISO } = req.query;
    if (!['doctors', 'rooms'].includes(type)) {
      return res.status(400).json({ error: 'Invalid type. Use doctors|rooms.' });
    }
    const data = type === 'doctors'
      ? listAvailableDoctors(startISO, endISO)
      : listAvailableRooms(startISO, endISO);
    return res.json({ data });
  }

  // PUBLIC_INTERFACE
  getAvailability(req, res) {
    /** Get availability windows for a doctor or room */
    const { type, id } = req.params;
    if (!['doctors', 'rooms'].includes(type)) {
      return res.status(400).json({ error: 'Invalid type. Use doctors|rooms.' });
    }
    const data = getAvailability(type, id);
    if (data == null) return res.status(404).json({ error: 'Not found' });
    return res.json({ data });
  }

  // PUBLIC_INTERFACE
  setAvailability(req, res) {
    /** Replace availability windows for a doctor or room */
    const { type, id } = req.params;
    if (!['doctors', 'rooms'].includes(type)) {
      return res.status(400).json({ error: 'Invalid type. Use doctors|rooms.' });
    }
    try {
      const saved = setAvailability(type, id, req.body?.windows || []);
      if (!saved) return res.status(404).json({ error: 'Not found' });
      return res.json({ data: saved });
    } catch (e) {
      const status = e.status || 500;
      return res.status(status).json({ error: e.message || 'Internal error' });
    }
  }
}

module.exports = new AvailabilityController();
