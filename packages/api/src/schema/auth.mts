import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { extendApi } from "../generator/options.mjs";
import { getErrorSchema } from "../generator/getErrorSchema.mjs";
import { z } from "zod";

export function registerAuth(registry: OpenAPIRegistry) {
  // Define the JWT security scheme in OpenAPI
  extendApi({
    security: [{ BearerAuth: [] }],
  });

  // Add this to the OpenAPI options when generating the spec
  registry.registerComponent("securitySchemes", "BearerAuth", {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
  });

  // Add ability to login and get a JWT token
  registry.registerPath({
    operationId: "login",
    tags: ["auth"],
    method: "post",
    path: "/login",
    request: {
      body: {
        content: {
          "application/json": {
            schema: z
              .object({
                username: z.string().min(1).openapi({ example: "admin" }),
                password: z.string().min(1).openapi({ example: "password" }),
              })
              .openapi("LoginRequest"),
          },
        },
      },
    },
    responses: {
      200: {
        description: "Login successful",
        content: {
          "application/json": {
            schema: z.object({ token: z.string() }).openapi("LoginResponse"),
          },
        },
      },
      ...getErrorSchema(),
    },
  });
}
