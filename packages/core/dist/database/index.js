// @bun
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};

// src/database/schema/index.ts
var exports_schema = {};
__export(exports_schema, {
  verifications: () => verifications,
  users: () => users,
  userRelations: () => userRelations,
  tasks: () => tasks,
  sessions: () => sessions,
  sessionRelations: () => sessionRelations,
  accounts: () => accounts,
  accountRelations: () => accountRelations
});

// src/database/schema/tasks.schema.ts
import { boolean, integer, pgTable, text as text2 } from "drizzle-orm/pg-core";

// src/database/schema/helpers.ts
import { sql } from "drizzle-orm";
import { timestamp } from "drizzle-orm/pg-core";
var timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => sql`CURRENT_TIMESTAMP`)
};

// src/database/schema/tasks.schema.ts
var tasks = pgTable("tasks", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text2("name").notNull(),
  done: boolean("done").notNull().default(false),
  ...timestamps
});
// src/database/schema/auth.schema.ts
var exports_auth_schema = {};
__export(exports_auth_schema, {
  verifications: () => verifications,
  users: () => users,
  userRelations: () => userRelations,
  sessions: () => sessions,
  sessionRelations: () => sessionRelations,
  accounts: () => accounts,
  accountRelations: () => accountRelations
});
import { relations } from "drizzle-orm";
import { pgTable as pgTable2, text as text3, timestamp as timestamp2, boolean as boolean2, index } from "drizzle-orm/pg-core";
var users = pgTable2("users", {
  id: text3("id").primaryKey(),
  name: text3("name").notNull(),
  email: text3("email").notNull().unique(),
  emailVerified: boolean2("email_verified").default(false).notNull(),
  image: text3("image"),
  createdAt: timestamp2("created_at").defaultNow().notNull(),
  updatedAt: timestamp2("updated_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date).notNull(),
  role: text3("role"),
  banned: boolean2("banned").default(false),
  banReason: text3("ban_reason"),
  banExpires: timestamp2("ban_expires")
});
var sessions = pgTable2("sessions", {
  id: text3("id").primaryKey(),
  expiresAt: timestamp2("expires_at").notNull(),
  token: text3("token").notNull().unique(),
  createdAt: timestamp2("created_at").defaultNow().notNull(),
  updatedAt: timestamp2("updated_at").$onUpdate(() => /* @__PURE__ */ new Date).notNull(),
  ipAddress: text3("ip_address"),
  userAgent: text3("user_agent"),
  userId: text3("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  impersonatedBy: text3("impersonated_by")
}, (table) => [index("sessions_userId_idx").on(table.userId)]);
var accounts = pgTable2("accounts", {
  id: text3("id").primaryKey(),
  accountId: text3("account_id").notNull(),
  providerId: text3("provider_id").notNull(),
  userId: text3("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  accessToken: text3("access_token"),
  refreshToken: text3("refresh_token"),
  idToken: text3("id_token"),
  accessTokenExpiresAt: timestamp2("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp2("refresh_token_expires_at"),
  scope: text3("scope"),
  password: text3("password"),
  createdAt: timestamp2("created_at").defaultNow().notNull(),
  updatedAt: timestamp2("updated_at").$onUpdate(() => /* @__PURE__ */ new Date).notNull()
}, (table) => [index("accounts_userId_idx").on(table.userId)]);
var verifications = pgTable2("verifications", {
  id: text3("id").primaryKey(),
  identifier: text3("identifier").notNull(),
  value: text3("value").notNull(),
  expiresAt: timestamp2("expires_at").notNull(),
  createdAt: timestamp2("created_at").defaultNow().notNull(),
  updatedAt: timestamp2("updated_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date).notNull()
}, (table) => [index("verifications_identifier_idx").on(table.identifier)]);
var userRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts)
}));
var sessionRelations = relations(sessions, ({ one }) => ({
  users: one(users, {
    fields: [sessions.userId],
    references: [users.id]
  })
}));
var accountRelations = relations(accounts, ({ one }) => ({
  users: one(users, {
    fields: [accounts.userId],
    references: [users.id]
  })
}));
// src/database/index.ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
var db;
function initDatabase(databaseUrl) {
  if (db) {
    return db;
  }
  const sql2 = neon(databaseUrl);
  db = drizzle(sql2, { schema: exports_schema });
  return db;
}
function getDatabase() {
  if (!db) {
    throw new Error("Database not initialized.");
  }
  return db;
}
export {
  initDatabase,
  getDatabase
};

//# debugId=10DBBE6FBCEEB8F564756E2164756E21
