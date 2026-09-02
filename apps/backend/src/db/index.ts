import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { logger } from "../lib/logger.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({ connectionString });

// Errors raised on idle pooled clients surface here; without a listener they
// become an unhandled 'error' event and kill the process.
pool.on("error", (err) => {
  logger.error(err, "unexpected database pool error");
});

export const db = drizzle(pool);

/** Verifies the database is reachable. Throws if it is not. */
export async function connectDatabase() {
  const client = await pool.connect();
  try {
    await client.query("select 1");
    logger.info("successfully connected to the database");
  } finally {
    client.release();
  }
}
