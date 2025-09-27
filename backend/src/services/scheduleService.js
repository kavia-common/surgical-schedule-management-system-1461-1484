'use strict';
const { db, list, get, create, update, remove } = require('../data/store');
const { detectConflicts } = require('./conflictService');
const { eventBus } = require('../utils/eventBus');

// PUBLIC_INTERFACE
function listSchedules(filter = {}) {
  /** List schedules with optional filtering by date range or status */
  let events = list(db.schedules);
  if (filter.status) {
    events = events.filter((e) => e.status === filter.status);
  }
  if (filter.from || filter.to) {
    const fromTs = filter.from ? new Date(filter.from).getTime() : -Infinity;
    const toTs = filter.to ? new Date(filter.to).getTime() : Infinity;
    events = events.filter((e) => {
      const s = new Date(e.startISO).getTime();
      const t = new Date(e.endISO).getTime();
      return s < toTs && fromTs < t;
    });
  }
  return events;
}

// PUBLIC_INTERFACE
function createSchedule(payload, { allowConflicts = false } = {}) {
  /** Create schedule with conflict detection. */
  const conflicts = detectConflicts(payload);
  if (conflicts.length && !allowConflicts) {
    const err = new Error('Conflicts detected');
    err.details = conflicts;
    err.status = 409;
    throw err;
  }
  const saved = create(db.schedules, payload);
  eventBus.emit('schedule.created', { id: saved.id, data: saved });
  return { saved, conflicts };
}

// PUBLIC_INTERFACE
function getSchedule(id) {
  /** Retrieve a schedule by id */
  return get(db.schedules, id);
}

// PUBLIC_INTERFACE
function updateSchedule(id, patch, { allowConflicts = false } = {}) {
  /** Update schedule with conflict detection */
  const current = db.schedules.get(id);
  if (!current) return null;
  const candidate = { ...current, ...patch, id };
  const conflicts = detectConflicts(candidate, { excludeId: id });
  if (conflicts.length && !allowConflicts) {
    const err = new Error('Conflicts detected');
    err.details = conflicts;
    err.status = 409;
    throw err;
  }
  const saved = update(db.schedules, id, patch);
  if (saved) eventBus.emit('schedule.updated', { id, data: saved });
  return { saved, conflicts };
}

// PUBLIC_INTERFACE
function deleteSchedule(id) {
  /** Delete a schedule */
  const ok = remove(db.schedules, id);
  if (ok) eventBus.emit('schedule.deleted', { id });
  return ok;
}

module.exports = {
  listSchedules,
  createSchedule,
  getSchedule,
  updateSchedule,
  deleteSchedule,
};
