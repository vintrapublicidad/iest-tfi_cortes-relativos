import { Pool } from 'pg';

/**
 * PostgreSQL Database Connection Module for Cortes Relativos
 * Uses pg.Pool for connection pooling and enforces parameterized queries.
 */

// Global pool instance to prevent creating multiple connections in development hot-reloading
let pool;

function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/cortes_relativos';
    const isProduction = process.env.NODE_ENV === 'production';

    pool = new Pool({
      connectionString,
      ssl: isProduction && !connectionString.includes('localhost')
        ? { rejectUnauthorized: false }
        : false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000, // Fallo rápido → activa el fallback en memoria
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle database client', err);
    });
  }
  return pool;
}

/**
 * Executes a parameterized SQL query safely.
 *
 * @param {string} text - SQL query with parameter placeholders ($1, $2, etc.)
 * @param {Array} params - Array of parameter values
 * @returns {Promise<import('pg').QueryResult>} Query result
 */
export async function query(text, params = []) {
  const currentPool = getPool();
  const start = Date.now();
  try {
    const res = await currentPool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.DEBUG_DB) {
      console.log('Executed query', { text, duration, rows: res.rowCount });
    }
    return res;
  } catch (error) {
    console.error('Database query error:', {
      text,
      error: error.message,
    });
    throw error;
  }
}

/**
 * Gets a dedicated client from the pool (useful for transactions).
 */
export async function getClient() {
  const currentPool = getPool();
  return await currentPool.connect();
}

export default {
  query,
  getClient,
  getPool,
};
