'use strict';
const { listResources, setDeviceStatus } = require('../services/resourcesService');
const { listSchedules, createSchedule, getSchedule, updateSchedule, deleteSchedule } = require('../services/scheduleService');

const { listAvailableDoctors, listAvailableRooms, getAvailability, setAvailability } = require('../services/availabilityService');

const resolvers = {
  doctors: () => listResources('doctors'),
  nurses: () => listResources('nurses'),
  rooms: () => listResources('rooms'),
  devices: () => listResources('devices'),
  schedules: ({ status, from, to }) => listSchedules({ status, from, to }),
  schedule: ({ id }) => getSchedule(id),

  // Availability queries
  availableDoctors: ({ startISO, endISO }) => listAvailableDoctors(startISO, endISO),
  availableRooms: ({ startISO, endISO }) => listAvailableRooms(startISO, endISO),
  doctorAvailability: ({ id }) => getAvailability('doctors', id),
  roomAvailability: ({ id }) => getAvailability('rooms', id),

  // Mutations
  createSchedule: ({ input, allowConflicts }) => {
    const { saved, conflicts } = createSchedule(input, { allowConflicts: !!allowConflicts });
    return { data: saved, conflicts: conflicts || [] };
  },
  updateSchedule: ({ id, patch, allowConflicts }) => {
    const result = updateSchedule(id, patch, { allowConflicts: !!allowConflicts });
    if (!result) return null;
    return { data: result.saved, conflicts: result.conflicts || [] };
  },
  deleteSchedule: ({ id }) => deleteSchedule(id),
  setDeviceStatus: ({ id, status, meta }) => setDeviceStatus(id, status, meta),

  setDoctorAvailability: ({ id, windows }) => setAvailability('doctors', id, windows),
  setRoomAvailability: ({ id, windows }) => setAvailability('rooms', id, windows),
};

module.exports = { resolvers };
