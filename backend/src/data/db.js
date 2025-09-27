'use strict';
/**
 * MSSQL database connection utility using mssql package and connection pooling.
 * Reads configuration from environment variables. Exposes:
 *  - getPool(): Promise<sql.ConnectionPool>
 *  - testConnection(): Promise<void> (throws on failure)
 *
 * Environment variables required:
 *  - MSSQL_SERVER
 *  - MSSQL_DATABASE
 *  - MSSQL_USER
 *  - MSSQL_PASSWORD
 *  - MSSQL_PORT (optional, defaults to 1433)
 *  - MSSQL_ENCRYPT (optional, defaults true for Azure compatibility; set to 'false' to disable)
 *  - MSSQL_TRUST_SERVER_CERTIFICATE (optional, defaults false; set to 'true' for local/self-signed)
 */

const sql = require('mssql');

let poolPromise; // cache the connection pool promise

function buildConfigFromEnv() {
  const {
    MSSQL_SERVER,
    MSSQL_DATABASE,
    MSSQL_USER,
    MSSQL_PASSWORD,
    MSSQL_PORT,
    MSSQL_ENCRYPT,
    MSSQL_TRUST_SERVER_CERTIFICATE,
  } = process.env;

  if (!MSSQL_SERVER || !MSSQL_DATABASE || !MSSQL_USER || !MSSQL_PASSWORD) {
    const missing = [
      !MSSQL_SERVER ? 'MSSQL_SERVER' : null,
      !MSSQL_DATABASE ? 'MSSQL_DATABASE' : null,
      !MSSQL_USER ? 'MSSQL_USER' : null,
      !MSSQL_PASSWORD ? 'MSSQL_PASSWORD' : null,
    ].filter(Boolean);
    const err = new Error(`Missing MSSQL environment variables: ${missing.join(', ')}`);
    err.code = 'MSSQL_ENV_MISSING';
    throw err;
  }

  const port = Number(MSSQL_PORT || 1433);
  const encrypt = String(MSSQL_ENCRYPT ?? 'true').toLowerCase() !== 'false';
  const trustServerCertificate = String(MSSQL_TRUST_SERVER_CERTIFICATE ?? 'false').toLowerCase() === 'true';

  return {
    server: MSSQL_SERVER,
    database: MSSQL_DATABASE,
    user: MSSQL_USER,
    password: MSSQL_PASSWORD,
    port,
    options: {
      encrypt,
      trustServerCertificate,
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  };
}

// PUBLIC_INTERFACE
async function getPool() {
  /** Returns a connected MSSQL pool (singleton). */
  if (!poolPromise) {
    const config = buildConfigFromEnv();
    poolPromise = sql.connect(config).catch((err) => {
      // reset so subsequent calls can retry
      poolPromise = undefined;
      throw err;
    });
  }
  return poolPromise;
}

// PUBLIC_INTERFACE
async function testConnection() {
  /** Attempts a simple DB connection + query (SELECT 1 as ok). Throws on failure. */
  const pool = await getPool();
  await pool.request().query('SELECT 1 as ok');
}

module.exports = {
  sql,
  getPool,
  testConnection,
};
