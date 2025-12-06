// build-vercel.ts
import { $ } from "bun";
import { resolve } from "path";

const ROOT = import.meta.dir;
const DIST = resolve(ROOT, "dist");
const API_DIR = resolve(ROOT, "");

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
      entrypoints: [resolve(API_DIR, "index.ts")],
      outdir: DIST,
      target: "node",
      format: "esm",
      splitting: false,
      minify: false,
      sourcemap: "external",
      external: [
        // Only external runtime dependencies
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
        "@neondatabase/serverless": "^1.0.2",
        ws: "^8.18.3"
      }
    };

    await Bun.write(
      resolve(DIST, "package.json"),
      JSON.stringify(deployPackageJson, null, 2)
    );

    console.log("✓ package.json created\n");
    console.log("🎉 Build completed successfully!");
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

build();
