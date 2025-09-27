'use strict';
const { listResources, setDeviceStatus } = require('../services/resourcesService');
const { listSchedules, createSchedule, getSchedule, updateSchedule, deleteSchedule } = require('../services/scheduleService');

const resolvers = {
  doctors: () => listResources('doctors'),
  nurses: () => listResources('nurses'),
  rooms: () => listResources('rooms'),
  devices: () => listResources('devices'),
  schedules: ({ status, from, to }) => listSchedules({ status, from, to }),
  schedule: ({ id }) => getSchedule(id),
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
};

module.exports = { resolvers };
