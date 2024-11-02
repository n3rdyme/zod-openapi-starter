import Fastify from "fastify";
import { nanoid } from "nanoid";
import { fastifySwagger, SwaggerOptions, FastifyStaticSwaggerOptions, StaticDocumentSpec } from "@fastify/swagger";
import { fastifySwaggerUi, FastifySwaggerUiOptions } from "@fastify/swagger-ui";
import { fastifyOpenapiGlue, type FastifyOpenapiGlueOptions } from "fastify-openapi-glue";
import { fastifyResponseValidation, type FastifyResponseValidationOptions } from "../middleware/responseValidation.mjs";
import fastifyJwt from "@fastify/jwt";
import { authMiddleware } from "../middleware/authMiddleware.mjs";
import { errorHandler } from "../middleware/errorHandler.mjs";
import { loggerOptions } from "../middleware/logger.mjs";
import { fastifyHandlers } from "../service/fastifyHandlers.mjs";
import { ajvDefaultOptions, createAjv } from "../middleware/ajv-validation.mjs";

import openApiSpec from "@local/api";
import { environment } from "../environment.mjs";

function createFastify() {
  // Create Fastify instance
  const fastify = Fastify({
    logger: loggerOptions,
    ajv: { customOptions: { ...ajvDefaultOptions, removeAdditional: false } },
    genReqId: () => nanoid(21),
  });

  fastify.addHook("onRequest", async (request, response) => {
    request.apiContext = {
      name: `${request.method} ${request.url}`,
      statusCode: 200,
      contentType: "application/json",
      request,
      response,
      logger: response.log,
      user: {
        username: "",
        timestamp: 0,
        roles: [],
      },
    };
  });

  // Register Fastify authentication plugin
  fastify.register(fastifyJwt, {
    // Use environment option 'JWT_SECRET' with an actual secure value in production
    secret: environment.jwtSecret,
  });

  // JWT Sign and Verify Helpers
  fastify.decorate("authenticate", authMiddleware);

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
    securityHandlers: {
      BearerAuth: authMiddleware,
    },
  };

  // Register FastifyOpenAPIGlue for routing and validation
  fastify.register(fastifyOpenapiGlue, glueOptions);

  // Error handler
  fastify.setErrorHandler(errorHandler);

  return fastify;
}

export const fastify = createFastify();
