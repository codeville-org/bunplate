import { Hono } from "hono";
import { logger } from "hono/logger";

const app = new Hono();

// Import at module-level for faster cold starts
import { initDatabase } from "core/database";
import type { Database } from "core/database";

// Module-level initialization - runs during cold start
let db: Database;

try {
  // Initialize database connection at module load
  db = initDatabase(process.env.DATABASE_URL!);

  // Initialize authentication at module load
  // setAuth({
  //   adapter: {
  //     drizzleDb: db,
  //     provider: "pg" // PostgreSQL for Vercel/Neon
  //   },
  //   secret: process.env.BETTER_AUTH_SECRET!
  // });
} catch (error) {
  console.error("Failed to initialize database/auth:", error);
  throw error;
}

// Middleware
app.use("*", logger());

app.get("/", async (c) => {
  const result = await db.execute(`select 'hello world' as text`);

  return c.json({
    message: "Hello from Bunplate API!",
    dbResult: result.rows[0]
  });
});

export default app;
