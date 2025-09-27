'use strict';

/**
 * Utility to generate simple unique IDs in-memory.
 * For production, replace with UUIDs or database-generated IDs.
 */
// PUBLIC_INTERFACE
function generateId(prefix = 'id') {
  /** Generate a unique ID string with timestamp and random segment. */
  const rand = Math.random().toString(36).substring(2, 8);
  const ts = Date.now().toString(36);
  return `${prefix}_${ts}_${rand}`;
}

module.exports = { generateId };
