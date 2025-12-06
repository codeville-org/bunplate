import { createAPIRouter } from "@/lib/setup-api";
import { OpenAPI } from "@/types";

import { BASE_PATH } from "@/lib/constants";

import index from "../routes/index.route";

export function registerRoutes(app: OpenAPI) {
  return app.route("/", index);
}

// Standalone router instance and type export for RPC
export const router = registerRoutes(createAPIRouter().basePath(BASE_PATH));

export type Router = typeof router;
