import Fastify from "fastify";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { fastifyOpenapiGlue, type FastifyOpenapiGlueOptions } from "fastify-openapi-glue";

import { fastifyResponseValidation, type FastifyResponseValidationOptions } from "./middleware/responseValidation.mjs";
import { authMiddleware } from "./middleware/authMiddleware.mjs";
import { errorHandler } from "./middleware/errorHandler.mjs";
import { customLogger } from "./middleware/logger.mjs";
import { fastifyHandlers } from "./service/fastifyHandlers.mjs";
import openApiSpec from "@local/api";
import { createAjv } from "./middleware/ajv-validation.mjs";
// import { type api } from "@local/api";

// Create Fastify instance
const fastify = Fastify({ logger: customLogger });

// Register Swagger plugin for API documentation
fastify.register(fastifySwagger, {
  mode: "dynamic",
  specification: {
    document: openApiSpec, // Directly pass the in-memory OpenAPI JSON
  },
  exposeRoute: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any);

fastify.register(fastifySwaggerUi, {
  routePrefix: "/docs",
  staticCSP: true,
  uiConfig: {
    deepLinking: false,
  },
});

const responseValidationOptions: FastifyResponseValidationOptions = {
  ajv: createAjv({ removeAdditional: false }),
  responseValidation: true,
  responseStatusCodeValidation: true,
};

fastify.register(fastifyResponseValidation, responseValidationOptions);

const glueOptions: FastifyOpenapiGlueOptions = {
  specification: openApiSpec, // Use the in-memory OpenAPI JSON here as well
  serviceHandlers: fastifyHandlers, // Path to your service handlers
  // noAdditional: true,
  prefix: undefined,
};

// Register FastifyOpenAPIGlue for routing and validation
fastify.register(fastifyOpenapiGlue, glueOptions);

// Add JWT authentication middleware
fastify.addHook("onRequest", authMiddleware);

// Error handler
fastify.setErrorHandler(errorHandler);

// Start the server
fastify.listen({ port: 3000 }, (err: unknown) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log("Server listening on http://localhost:3000");
  console.log("API docs available at http://localhost:3000/docs");
});
