'use strict';

/**
 * Lightweight schema-like validators and defaults for resources and schedules.
 * This is DB-ready scaffolding: replace with real ORM models (e.g., Mongoose/Prisma) later.
 */

// PUBLIC_INTERFACE
function validateDoctor(payload) {
  /** Basic validator for Doctor object */
  const errors = [];
  const out = { ...payload };

  if (!out.name || typeof out.name !== 'string') errors.push('name is required');
  if (!Array.isArray(out.specialties)) out.specialties = [];
  if (typeof out.active !== 'boolean') out.active = true;

  // Availability windows for doctors: array of { dayOfWeek: 0-6, start: 'HH:MM', end: 'HH:MM' }
  if (!Array.isArray(out.availability)) out.availability = [];
  return { ok: errors.length === 0, errors, value: out };
}

// PUBLIC_INTERFACE
function validateRoom(payload) {
  /** Basic validator for Room object */
  const errors = [];
  const out = { ...payload };

  if (!out.name || typeof out.name !== 'string') errors.push('name is required');
  if (typeof out.capacity !== 'number' || out.capacity <= 0) out.capacity = 1;
  if (typeof out.active !== 'boolean') out.active = true;

  // Availability windows for rooms
  if (!Array.isArray(out.availability)) out.availability = [];
  return { ok: errors.length === 0, errors, value: out };
}

// PUBLIC_INTERFACE
function validateSchedule(payload) {
  /** Basic validator for ScheduleEvent object */
  const errors = [];
  const out = { ...payload };

  const time = (s) => new Date(s).getTime();
  if (!out.title) errors.push('title is required');
  if (!out.procedureType) errors.push('procedureType is required');
  if (!out.startISO || isNaN(time(out.startISO))) errors.push('startISO is invalid');
  if (!out.endISO || isNaN(time(out.endISO))) errors.push('endISO is invalid');
  if (out.startISO && out.endISO && time(out.startISO) >= time(out.endISO)) {
    errors.push('startISO must be before endISO');
  }
  if (!out.roomId) errors.push('roomId is required');
  if (!out.doctorId) errors.push('doctorId is required');
  if (!Array.isArray(out.nurseIds)) out.nurseIds = [];
  if (!Array.isArray(out.deviceIds)) out.deviceIds = [];
  if (!out.status) out.status = 'planned';

  return { ok: errors.length === 0, errors, value: out };
}

module.exports = {
  validateDoctor,
  validateRoom,
  validateSchedule,
};
