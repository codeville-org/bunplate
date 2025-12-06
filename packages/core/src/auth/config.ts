import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { getDatabase } from "../database";
import * as schema from "../database/schema";
import { admin, openAPI } from "better-auth/plugins";

export const auth = betterAuth({
  trustedOrigins: [process.env.CLIENT_URL!],
  baseURL: process.env.BETTER_AUTH_URL!,

  database: drizzleAdapter(getDatabase(), {
    provider: "pg",
    usePlural: true,
    schema
  }),
  emailAndPassword: {
    enabled: true
  },

  plugins: [admin(), openAPI()]
});

export type Auth = typeof auth;
