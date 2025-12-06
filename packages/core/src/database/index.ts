import { neon, neonConfig, Pool } from "@neondatabase/serverless";
import { drizzle, type NeonDatabase } from "drizzle-orm/neon-serverless";
import ws from "ws";

import * as schema from "./schema";

// Configure WebSocket for Node.jS / Vercel Environments
neonConfig.webSocketConstructor = ws;

// Initialize and export the database instance
let db: NeonDatabase<typeof schema> & {
  $client: Pool;
};

export type Database = typeof db;

/**
 * Initialize the database connection
 * @param databaseUrl
 * @returns
 */
export function initDatabase(databaseUrl: string) {
  if (db) {
    return db;
  }

  // Use connection pooling
  const pool = new Pool({ connectionString: databaseUrl });

  db = drizzle(pool, { schema });

  return db;
}

/**
 * Get the database instance
 * @returns
 */
export function getDatabase() {
  if (!db) {
    throw new Error("Database not initialized.");
  }

  return db;
}
