import { todoApi } from "./api/index.mjs";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { registerAuth } from "./auth.mjs";
import { EnvironmentDataSchema } from "./environment.mjs";

/**
 * Register all API endpoints with the given OpenAPI registry
 * @param registry The openapi registry to register the API with
 *
 * @summary Feel free to organize this `schema` directory in any way you like.
 * The only external dependency is from `../generator/generate.mts` which depends
 * on the following method being defined.
 *
 */
export function register(registry: OpenAPIRegistry) {
  // Register authentication schemes
  registerAuth(registry);

  // Register all apis
  todoApi.forEach((api) => registry.registerApi(api));

  // Register data structures that are not directly used by an API
  registry.register("EnvironmentData", EnvironmentDataSchema);
}
