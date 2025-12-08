import { Scalar } from "@scalar/hono-api-reference";

import { APIBindings, OpenAPI } from "@/types";

import packageJson from "../../package.json";
import { BASE_PATH } from "./constants";
import { OpenAPIHono } from "@hono/zod-openapi";

export default function configureOpenAPI(app: OpenAPIHono<APIBindings>): void {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Bunplate (by CodeVille)"
    }
  });

  app.get(
    "/reference",
    Scalar(() => ({
      url: `${BASE_PATH}/doc`,
      theme: "default"
    }))
  );
}
