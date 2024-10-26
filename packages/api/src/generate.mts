import { extendZodWithOpenApi, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { writeFileSync } from "fs";
import path from "path";
import { z } from "zod";

async function main(...args: string[]) {
  const targetFile = args[0];
  // 1. Extend Zod with OpenAPI
  extendZodWithOpenApi(z);

  // 2. Register definitions here
  const registry = await import("./schema/registry.mjs");

  await import("./schema/index.mjs");

  // 3. Generate OpenAPI components
  const generator = new OpenApiGeneratorV3(registry.default.definitions);

  const openApi = generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "ToDo API",
      description: "This is the API",
    },
    servers: [{ url: "/" }],
  });

  const openapiJson = JSON.stringify(openApi, null, 2);
  writeFileSync(path.join(import.meta.dirname, targetFile), openapiJson);
}

main(...process.argv.slice(2)).catch((ex) => {
  console.error(ex);
  process.exit(1);
});
