#!/usr/bin/env node
import { build } from "esbuild";

build({
  entryPoints: ["src/index.mts"],
  bundle: true,
  minify: true,
  platform: "node",
  outdir: "./dist",
  format: "esm",
  target: ["node22"],
  outExtension: { ".js": ".mjs" },
  banner: {
    js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);",
  },
}).catch((ex) => {
  console.error(ex);
  process.exit(1);
});
