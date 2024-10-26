import Fastify from "fastify";
import { fastifySwagger, SwaggerOptions, FastifyStaticSwaggerOptions, StaticDocumentSpec } from "@fastify/swagger";
import { fastifySwaggerUi, FastifySwaggerUiOptions } from "@fastify/swagger-ui";
import { fastifyOpenapiGlue, type FastifyOpenapiGlueOptions } from "fastify-openapi-glue";

import { fastifyResponseValidation, type FastifyResponseValidationOptions } from "../middleware/responseValidation.mjs";
import { authMiddleware } from "../middleware/authMiddleware.mjs";
import { errorHandler } from "../middleware/errorHandler.mjs";
import { loggerOptions } from "../middleware/logger.mjs";
import { fastifyHandlers } from "../service/fastifyHandlers.mjs";
import { createAjv } from "../middleware/ajv-validation.mjs";

import openApiSpec from "@local/api";

function createFastify() {
  // Create Fastify instance
  const fastify = Fastify({ logger: loggerOptions });

  const swaggerOptions: SwaggerOptions & FastifyStaticSwaggerOptions = {
    mode: "static",
    // exposeRoute: true,
    specification: {
      document: openApiSpec, // Directly pass the in-memory OpenAPI JSON
    } as unknown as StaticDocumentSpec,
  };

  // Register Swagger plugin for API documentation
  fastify.register(fastifySwagger, swaggerOptions);

  const swaggerUiOptions: FastifySwaggerUiOptions = {
    routePrefix: "/docs",
    staticCSP: true,
    uiConfig: {
      deepLinking: false,
    },
  };

  fastify.register(fastifySwaggerUi, swaggerUiOptions);

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

  return fastify;
}

export const fastify = createFastify();
