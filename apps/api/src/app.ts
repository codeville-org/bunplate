// let app: OpenAPIHono<APIBindings>;

// Import at module-level for faster cold starts
import { OpenAPIHono } from "@hono/zod-openapi";
import { Hono } from "hono";

import { initDatabase } from "core/database";
import type { Database } from "core/database";
import { setupAuth } from "core/auth/setup";

import { APIBindings } from "./types";
import { setupAPI } from "./lib/setup-api";
import { registerRoutes } from "./registry";
import configureOpenAPI from "./lib/open-api-config";

// Module-level initialization - runs during cold start
let db: Database;

try {
  // Initialize database connection at module load
  db = initDatabase(process.env.DATABASE_URL!);

  // Initialize authentication at module load
  setupAuth({
    database: db,
    secret: process.env.BETTER_AUTH_SECRET!
  });

  // app = registerRoutes(setupAPI());

  // configureOpenAPI(app);
} catch (error) {
  console.error("Failed to initialize database/auth:", error);

  throw error;
}

// app that returns 500 for all requests
const app = new Hono<APIBindings>();

app.get("/", (c) => {
  return c.json({ message: "Test vercel" }, 200);
});

export default app;
