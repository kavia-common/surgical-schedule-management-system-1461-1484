'use strict';
const {
  listSchedules,
  createSchedule,
  getSchedule,
  updateSchedule,
  deleteSchedule,
} = require('../services/scheduleService');
const { detectConflicts, suggestNextAvailableSlot } = require('../services/conflictService');

class SchedulesController {
  // PUBLIC_INTERFACE
  list(req, res) {
    /** List schedules with optional filters ?status=&from=&to= */
    const { status, from, to } = req.query;
    const data = listSchedules({ status, from, to });
    return res.json({ data });
  }

  // PUBLIC_INTERFACE
  create(req, res) {
    /** Create schedule. Optional query allowConflicts=true */
    const allowConflicts = String(req.query.allowConflicts || '').toLowerCase() === 'true';
    try {
      const { saved, conflicts } = createSchedule(req.body, { allowConflicts });
      return res.status(conflicts?.length ? 201 : 201).json({ data: saved, conflicts });
    } catch (e) {
      if (e.status === 409) {
        return res.status(409).json({ error: e.message, conflicts: e.details });
      }
      console.error(e);
      return res.status(500).json({ error: 'Internal error' });
    }
  }

  // PUBLIC_INTERFACE
  get(req, res) {
    /** Get schedule by id */
    const ev = getSchedule(req.params.id);
    if (!ev) return res.status(404).json({ error: 'Not found' });
    return res.json({ data: ev });
  }

  // PUBLIC_INTERFACE
  update(req, res) {
    /** Update schedule. Optional query allowConflicts=true */
    const allowConflicts = String(req.query.allowConflicts || '').toLowerCase() === 'true';
    try {
      const result = updateSchedule(req.params.id, req.body, { allowConflicts });
      if (!result) return res.status(404).json({ error: 'Not found' });
      return res.json({ data: result.saved, conflicts: result.conflicts });
    } catch (e) {
      if (e.status === 409) {
        return res.status(409).json({ error: e.message, conflicts: e.details });
      }
      console.error(e);
      return res.status(500).json({ error: 'Internal error' });
    }
  }

  // PUBLIC_INTERFACE
  delete(req, res) {
    /** Delete schedule */
    const ok = deleteSchedule(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Not found' });
    return res.status(204).send();
  }

  // PUBLIC_INTERFACE
  conflicts(req, res) {
    /** Dry-run conflict detection for a candidate schedule payload */
    const conflicts = detectConflicts(req.body || {});
    return res.json({ conflicts });
  }

  // PUBLIC_INTERFACE
  suggest(req, res) {
    /** Suggest next available slot for a candidate schedule */
    const duration = Number(req.query.durationMinutes || 60);
    const horizon = Number(req.query.horizonMinutes || 8 * 60);
    const suggestion = suggestNextAvailableSlot(req.body || {}, duration, horizon);
    if (!suggestion) return res.status(404).json({ error: 'No slot found' });
    return res.json({ suggestion });
  }
}

module.exports = new SchedulesController();
