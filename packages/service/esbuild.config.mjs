#!/usr/bin/env node
import fs from "fs-extra";
import path from "path";
import { build } from "esbuild";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

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
  // external: ["pino", "pino-pretty", "@fastify/swagger-ui", "@fastify/static", "graphql", "graphiql"],
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
    // esbuildPluginPino({ transports: ["pino-pretty"] }),
    {
      name: "clean",
      setup: (build) => {
        build.onStart(() => {
          if (build.initialOptions.outdir && fs.existsSync(build.initialOptions.outdir))
            fs.rmSync(build.initialOptions.outdir, { recursive: true });
        });
      },
    },
    // {
    //   // bundling support for various libraries
    //   name: "copy",
    //   setup(build) {
    //     build.onResolve({ filter: /lib\/worker\.js$/ }, (args) => {
    //       console.log(args);
    //       return { path: path.resolve(process.cwd(), "../../node_modules/pino/", "lib/worker.js") };
    //     });
    //     build.onEnd(() => {
    //       [
    //         ["./src/", "proto"],
    //         // ["../../", "node_modules/pino"],
    //         // ["../../", "node_modules/pino-pretty"],
    //         // ["../../", "node_modules/@fastify/swagger-ui"],
    //         // ["../../node_modules/@apidevtools/openapi-schemas/", "schemas/v3.0/schema.json"],
    //       ].forEach(([pkg, file]) => {
    //         const src = path.join(
    //           pkg.startsWith(".") ? path.resolve(process.cwd(), pkg) : path.dirname(require.resolve(pkg)),
    //           file,
    //         );

    //         const dest = path.resolve(build.initialOptions.outdir, file);
    //         fs.mkdirSync(path.dirname(dest), { recursive: true });
    //         // console.log(`copying ${src}\n     => ${dest}`);
    //         fs.copySync(src, dest);
    //       });
    //     });
    //   },
    // },
  ],
}).catch((ex) => {
  console.error(ex);
  process.exit(1);
});
