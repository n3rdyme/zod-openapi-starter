import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { z } from "zod";
import { extendZodWithOpenApi, OpenApiGeneratorV3, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { hookGenerateSchemaWithMetadata } from "./hookGenerateSchemaWithMetadata.mjs";
import { hookRepositoryRegisterApi } from "./hookRepositoryRegisterApi.mjs";

async function main(...args: string[]) {
  const targetFile = path.join(process.cwd(), args[0]);
  const rootSrcDir = path.join(import.meta.dirname, "../openapi.json");
  const openApiData = JSON.parse(readFileSync(rootSrcDir, "utf-8"));

  // 1. Extend Zod with OpenAPI
  extendZodWithOpenApi(z);

  // 2. Create the OpenAPI registry and add "friendlier" registerApi method
  const registry = hookRepositoryRegisterApi(new OpenAPIRegistry());

  // 3. Register all schemas/endpoints
  const { register } = await import("../schema/index.mjs");
  register(registry);

  // 4. Generate OpenAPI components
  const generator = hookGenerateSchemaWithMetadata(new OpenApiGeneratorV3(registry.definitions));

  // 5. Generate OpenAPI document
  const openApi = generator.generateDocument({
    ...openApiData,
    path: undefined,
    components: undefined,
  });

  // 6. Write OpenAPI document to output file
  const openapiJson = JSON.stringify(openApi, null, 2);
  writeFileSync(targetFile, openapiJson);
}

main(...process.argv.slice(2)).catch((ex) => {
  console.error(ex);
  process.exit(1);
});
