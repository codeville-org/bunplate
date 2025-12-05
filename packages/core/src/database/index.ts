import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

// Bun automatically loads the DATABASE_URL from .env.local
// Refer to: https://bun.com/docs/runtime/environment-variables for more information
const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });

// Helper for backwards compatibility
export const getDb = () => db;

export type Database = typeof db;
