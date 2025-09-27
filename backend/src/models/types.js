/**
 * @typedef {Object} Doctor
 * @property {string} id
 * @property {string} name
 * @property {string[]} specialties
 * @property {boolean} active
 */

/**
 * @typedef {Object} Nurse
 * @property {string} id
 * @property {string} name
 * @property {string[]} skills
 * @property {boolean} active
 */

/**
 * @typedef {Object} Room
 * @property {string} id
 * @property {string} name
 * @property {number} capacity
 * @property {boolean} active
 */

/**
 * @typedef {Object} Device
 * @property {string} id
 * @property {string} name
 * @property {'available'|'in-use'|'maintenance'|'offline'} status
 * @property {Object<string, any>} [meta]
 */

/**
 * @typedef {Object} ScheduleEvent
 * @property {string} id
 * @property {string} title
 * @property {string} procedureType
 * @property {string} startISO
 * @property {string} endISO
 * @property {string} roomId
 * @property {string} doctorId
 * @property {string[]} nurseIds
 * @property {string[]} deviceIds
 * @property {'planned'|'in-progress'|'completed'|'cancelled'} status
 * @property {string} [notes]
 */
