'use strict';
const { generateId } = require('../utils/id');

/**
 * In-memory store. For production, replace with a DB layer.
 */
const db = {
  doctors: new Map(),
  nurses: new Map(),
  rooms: new Map(),
  devices: new Map(),
  schedules: new Map(),
  // Availability collections (per resource id)
  doctorAvailability: new Map(), // id -> [{ dayOfWeek, start, end }]
  roomAvailability: new Map(),   // id -> [{ dayOfWeek, start, end }]
};

function seed() {
  const d1 = { id: generateId('doc'), name: 'Dr. Alice Carter', specialties: ['Cardiology'], active: true };
  const d2 = { id: generateId('doc'), name: 'Dr. Ben Ortiz', specialties: ['Orthopedics'], active: true };

  const n1 = { id: generateId('nurse'), name: 'Nancy Hill', skills: ['OR', 'Anesthesia'], active: true };
  const n2 = { id: generateId('nurse'), name: 'Peter Shaw', skills: ['OR'], active: true };

  const r1 = { id: generateId('room'), name: 'OR-1', capacity: 2, active: true };
  const r2 = { id: generateId('room'), name: 'OR-2', capacity: 1, active: true };

  const dev1 = { id: generateId('dev'), name: 'Anesthesia Machine #1', status: 'available', meta: { model: 'AM-100' } };
  const dev2 = { id: generateId('dev'), name: 'Heart Monitor #2', status: 'available', meta: { model: 'HM-200' } };

  [d1, d2].forEach((x) => db.doctors.set(x.id, x));
  [n1, n2].forEach((x) => db.nurses.set(x.id, x));
  [r1, r2].forEach((x) => db.rooms.set(x.id, x));
  [dev1, dev2].forEach((x) => db.devices.set(x.id, x));

  // Seed simple weekday availability 08:00-18:00 for doctors and rooms
  [d1, d2].forEach((doc) => {
    const windows = Array.from({ length: 5 }).map((_, i) => ({
      dayOfWeek: i + 1, // Mon-Fri
      start: '08:00',
      end: '18:00',
    }));
    db.doctorAvailability.set(doc.id, windows);
  });

  [r1, r2].forEach((room) => {
    const windows = Array.from({ length: 7 }).map((_, i) => ({
      dayOfWeek: i, // Sun-Sat
      start: '07:00',
      end: '20:00',
    }));
    db.roomAvailability.set(room.id, windows);
  });

  // initial schedule
  const now = Date.now();
  const ev1 = {
    id: generateId('evt'),
    title: 'Knee Replacement',
    procedureType: 'Orthopedics',
    startISO: new Date(now + 60 * 60 * 1000).toISOString(),
    endISO: new Date(now + 3 * 60 * 60 * 1000).toISOString(),
    roomId: r1.id,
    doctorId: d2.id,
    nurseIds: [n1.id],
    deviceIds: [dev2.id],
    status: 'planned',
    notes: 'Patient NPO after midnight.',
  };
  db.schedules.set(ev1.id, ev1);
}

// Helpers
const list = (m) => Array.from(m.values());
const get = (m, id) => m.get(id) || null;
const create = (m, obj) => {
  const id = obj.id || generateId('id');
  const toSave = { ...obj, id };
  m.set(id, toSave);
  return toSave;
};
const update = (m, id, patch) => {
  const curr = m.get(id);
  if (!curr) return null;
  const updated = { ...curr, ...patch, id };
  m.set(id, updated);
  return updated;
};
const remove = (m, id) => m.delete(id);

seed();

module.exports = {
  db, list, get, create, update, remove,
};
