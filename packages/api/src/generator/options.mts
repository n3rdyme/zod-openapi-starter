import { RouteConfig } from "@asteasolutions/zod-to-openapi";

let apiExtensions: Partial<RouteConfig> = {};

export function extendApi(options: Partial<RouteConfig>) {
  // Extend the OpenAPI options with the provided options
  // This function is used to define the JWT security scheme
  // in the OpenAPI spec
  apiExtensions = JSON.parse(JSON.stringify({ ...apiExtensions, ...options }));
}

export function getApiExtensions() {
  return apiExtensions;
}
