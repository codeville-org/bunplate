// build-vercel.ts
import { $ } from "bun";
import { resolve } from "path";

import packageJson from "../package.json";
import { router } from "../src/registry";

// Establish directory structure
const BUILDERS_DIR = import.meta.dir;
const API_ROOT = resolve(BUILDERS_DIR, "..");
const DIST = resolve(API_ROOT, "dist");

async function build() {
  console.log("🔨 Building for Vercel deployment...\n");

  try {
    // Build core package first
    console.log("📦 Building core package...");
    await $`bun run --filter core build`;
    console.log("✓ Core package built\n");

    // Bundle API application
    console.log("📦 Bundling API application...");

    const result = await Bun.build({
      entrypoints: [resolve(API_ROOT, "index.ts")],
      outdir: DIST,
      target: "node",
      format: "esm",
      splitting: false,
      minify: false,
      sourcemap: "external",
      external: [
        "hono",
        "hono/*",
        "@hono/zod-openapi",
        "@scalar/hono-api-reference",
        "stoker",
        "@neondatabase/serverless",
        "ws"
      ],
      naming: {
        entry: "index.js"
      }
    });

    if (!result.success) {
      console.error("❌ Build failed:");
      for (const message of result.logs) {
        console.error(message);
      }
      process.exit(1);
    }

    console.log("✓ API bundled successfully");
    console.log(`✓ Generated ${result.outputs.length} file(s)\n`);

    // Create minimal package.json for deployment
    console.log("📝 Creating package.json for deployment...");

    const deployPackageJson = {
      type: "module",
      dependencies: {
        hono: "^4.10.7",
        "@hono/zod-openapi": "^1.1.5",
        "@scalar/hono-api-reference": "^0.9.26",
        stoker: "^2.0.1",
        "@neondatabase/serverless": "^1.0.2",
        ws: "^8.18.3"
      }
    };

    await Bun.write(
      resolve(DIST, "package.json"),
      JSON.stringify(deployPackageJson, null, 2)
    );

    console.log("✓ package.json created\n");

    // Generate open api documentation
    console.log("📄 Generating OpenAPI documentation...");

    const specs = router.getOpenAPIDocument({
      openapi: "3.0.0",
      info: {
        version: packageJson.version,
        title: packageJson.name
      }
    });

    await Bun.write(
      resolve(DIST, "public", "openapi.json"),
      JSON.stringify(specs, null, 2)
    );

    console.log("✅ OpenAPI spec generated at public/openapi.json");

    console.log("🎉 Build completed successfully!");
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

build();
