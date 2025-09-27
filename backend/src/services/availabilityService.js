'use strict';
const { db } = require('../data/store');

/**
 * Helpers for availability handling and listing available doctors/rooms in a given time window.
 */
function toMinutes(hhmm) {
  const [h, m] = (hhmm || '').split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}
function minutesSinceMidnight(date) {
  const d = new Date(date);
  return d.getHours() * 60 + d.getMinutes();
}
function isWithinAvailability(avails, start, end) {
  // Check if a [start,end] on a specific day is within any availability window for that day
  const dow = new Date(start).getDay();
  const startMin = minutesSinceMidnight(start);
  const endMin = minutesSinceMidnight(end);
  const dayWindows = (avails || []).filter((w) => w.dayOfWeek === dow);
  return dayWindows.some((w) => {
    const ws = toMinutes(w.start);
    const we = toMinutes(w.end);
    if (ws == null || we == null) return false;
    return ws <= startMin && endMin <= we;
  });
}
function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

// PUBLIC_INTERFACE
function listAvailableDoctors(startISO, endISO) {
  /** List doctors available now or in provided window (default: now->now) */
  const now = new Date();
  const start = startISO ? new Date(startISO) : now;
  const end = endISO ? new Date(endISO) : now;

  const startTs = start.getTime();
  const endTs = end.getTime();

  // Doctors active, within availability window, and not booked in schedules
  const result = [];
  for (const doc of db.doctors.values()) {
    if (!doc.active) continue;
    const avails = db.doctorAvailability.get(doc.id) || [];
    if (avails.length && !isWithinAvailability(avails, start, end)) continue;

    // not overlapping with existing schedule for this doctor
    let busy = false;
    for (const ev of db.schedules.values()) {
      if (ev.doctorId !== doc.id) continue;
      const evS = new Date(ev.startISO).getTime();
      const evE = new Date(ev.endISO).getTime();
      if (overlaps(startTs, endTs, evS, evE)) {
        busy = true; break;
      }
    }
    if (!busy) result.push(doc);
  }
  return result;
}

// PUBLIC_INTERFACE
function listAvailableRooms(startISO, endISO) {
  /** List rooms available in window and active */
  const now = new Date();
  const start = startISO ? new Date(startISO) : now;
  const end = endISO ? new Date(endISO) : now;

  const startTs = start.getTime();
  const endTs = end.getTime();

  const result = [];
  for (const room of db.rooms.values()) {
    if (!room.active) continue;
    const avails = db.roomAvailability.get(room.id) || [];
    if (avails.length && !isWithinAvailability(avails, start, end)) continue;

    let busy = false;
    for (const ev of db.schedules.values()) {
      if (ev.roomId !== room.id) continue;
      const evS = new Date(ev.startISO).getTime();
      const evE = new Date(ev.endISO).getTime();
      if (overlaps(startTs, endTs, evS, evE)) {
        busy = true; break;
      }
    }
    if (!busy) result.push(room);
  }
  return result;
}

// PUBLIC_INTERFACE
function getAvailability(type, id) {
  /** Fetch availability windows for a doctor or room */
  if (type === 'doctors') return db.doctorAvailability.get(id) || [];
  if (type === 'rooms') return db.roomAvailability.get(id) || [];
  return null;
}

// PUBLIC_INTERFACE
function setAvailability(type, id, windows) {
  /** Replace availability windows for a doctor or room */
  if (!Array.isArray(windows)) {
    const err = new Error('windows must be an array');
    err.status = 400;
    throw err;
  }
  const norm = windows.map((w) => ({
    dayOfWeek: Number(w.dayOfWeek),
    start: String(w.start || ''),
    end: String(w.end || ''),
  }));
  if (type === 'doctors') {
    if (!db.doctors.has(id)) return null;
    db.doctorAvailability.set(id, norm);
    return norm;
  }
  if (type === 'rooms') {
    if (!db.rooms.has(id)) return null;
    db.roomAvailability.set(id, norm);
    return norm;
  }
  return null;
}

module.exports = {
  listAvailableDoctors,
  listAvailableRooms,
  getAvailability,
  setAvailability,
};
