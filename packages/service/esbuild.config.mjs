#!/usr/bin/env node
import fs from "fs-extra";
import { build } from "esbuild";

build({
  entryPoints: ["src/**/*.mts", "src/proto/**"],
  minify: true,
  bundle: false,
  splitting: false,
  sourcemap: "inline",
  platform: "node",
  outdir: "./dist",
  format: "esm",
  target: ["node22"],
  outExtension: { ".js": ".mjs" },
  loader: {
    ".json": "copy",
    ".proto": "copy",
  },
  banner: {
    js:
      "import { createRequire } from 'module'; const require = createRequire(import.meta.url);" +
      "import { fileURLToPath } from 'url';const __filename = fileURLToPath(import.meta.url);const __dirname = require('path').dirname(__filename);",
  },
  plugins: [
    {
      name: "clean",
      setup: (build) => {
        build.onStart(() => {
          if (build.initialOptions.outdir && fs.existsSync(build.initialOptions.outdir))
            fs.rmSync(build.initialOptions.outdir, { recursive: true });
        });
      },
    },
  ],
}).catch((ex) => {
  console.error(ex);
  process.exit(1);
});
