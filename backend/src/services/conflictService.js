'use strict';
const { db } = require('../data/store');

/**
 * Detect conflicts for a given schedule payload or existing event.
 * Conflicts checked:
 *  - Room occupied overlapping in time
 *  - Doctor assigned to another overlapping event
 *  - Any nurse assigned to another overlapping event
 *  - Any device in use or assigned to another overlapping event
 *  - Start < End validation
 */
function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

// PUBLIC_INTERFACE
function detectConflicts(candidate, { excludeId } = {}) {
  /** Returns array of conflict objects: { type, message, relatedEventId } */
  const conflicts = [];
  const start = new Date(candidate.startISO).getTime();
  const end = new Date(candidate.endISO).getTime();
  if (isNaN(start) || isNaN(end) || start >= end) {
    conflicts.push({ type: 'time', message: 'Invalid time window: start must be before end' });
    return conflicts;
  }

  for (const ev of db.schedules.values()) {
    if (excludeId && ev.id === excludeId) continue;
    const bStart = new Date(ev.startISO).getTime();
    const bEnd = new Date(ev.endISO).getTime();
    if (!overlaps(start, end, bStart, bEnd)) continue;

    if (candidate.roomId && ev.roomId === candidate.roomId) {
      conflicts.push({ type: 'room', message: `Room is already booked by event ${ev.id}`, relatedEventId: ev.id });
    }
    if (candidate.doctorId && ev.doctorId === candidate.doctorId) {
      conflicts.push({ type: 'doctor', message: `Doctor is already booked by event ${ev.id}`, relatedEventId: ev.id });
    }
    const nurseIntersection = (candidate.nurseIds || []).filter((n) => (ev.nurseIds || []).includes(n));
    if (nurseIntersection.length) {
      conflicts.push({ type: 'nurse', message: `Nurse(s) ${nurseIntersection.join(', ')} already booked by event ${ev.id}`, relatedEventId: ev.id });
    }
    const deviceIntersection = (candidate.deviceIds || []).filter((d) => (ev.deviceIds || []).includes(d));
    if (deviceIntersection.length) {
      conflicts.push({ type: 'device', message: `Device(s) ${deviceIntersection.join(', ')} already booked by event ${ev.id}`, relatedEventId: ev.id });
    }
  }

  // device status validation
  for (const devId of candidate.deviceIds || []) {
    const dev = db.devices.get(devId);
    if (!dev) {
      conflicts.push({ type: 'device', message: `Device ${devId} not found` });
    } else if (dev.status === 'maintenance' || dev.status === 'offline') {
      conflicts.push({ type: 'device', message: `Device ${dev.name} is not available (status: ${dev.status})` });
    }
  }

  return conflicts;
}

// PUBLIC_INTERFACE
function suggestNextAvailableSlot(candidate, durationMinutes = 60, horizonMinutes = 8 * 60) {
  /**
   * Naive suggestion: iterate forward in 15-minute increments up to horizon,
   * return the first non-conflicting window.
   */
  const increment = 15; // minutes
  let start = new Date(candidate.startISO).getTime();
  const durationMs = (candidate.endISO ? (new Date(candidate.endISO).getTime() - start) : durationMinutes * 60000);
  const horizon = start + horizonMinutes * 60000;

  while (start < horizon) {
    const tryEvent = { ...candidate, startISO: new Date(start).toISOString(), endISO: new Date(start + durationMs).toISOString() };
    if (detectConflicts(tryEvent).length === 0) {
      return { startISO: tryEvent.startISO, endISO: tryEvent.endISO };
    }
    start += increment * 60000;
  }
  return null;
}

module.exports = { detectConflicts, suggestNextAvailableSlot };
