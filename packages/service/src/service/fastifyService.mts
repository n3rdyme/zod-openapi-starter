import Fastify, { FastifyRequest } from "fastify";
import { nanoid } from "nanoid";
import { fastifySwagger, SwaggerOptions, FastifyStaticSwaggerOptions, StaticDocumentSpec } from "@fastify/swagger";
import { fastifySwaggerUi, FastifySwaggerUiOptions } from "@fastify/swagger-ui";
import { fastifyOpenapiGlue, type FastifyOpenapiGlueOptions } from "fastify-openapi-glue";
import {
  fastifyResponseValidation,
  type Options as FastifyResponseValidationOptions,
} from "@fastify/response-validation";
import fastifyCors, { type FastifyCorsOptions } from "@fastify/cors";
import fastifyJwt, { type FastifyJWTOptions } from "@fastify/jwt";
import fastifyRateLimit, { type RateLimitPluginOptions, type errorResponseBuilderContext } from "@fastify/rate-limit";
import fastifyHelmet, { type FastifyHelmetOptions } from "@fastify/helmet";
import { authMiddleware } from "../middleware/authMiddleware.mjs";
import { errorHandler } from "../middleware/errorHandler.mjs";
import { loggerOptions } from "../middleware/logger.mjs";
import { fastifyHandlers } from "../service/fastifyHandlers.mjs";
import { ajvDefaultOptions, createAjv } from "../middleware/ajvValidation.mjs";

import openApiSpec from "@local/api";
import { environment } from "../environment.mjs";
import { ErrorDetails } from "../generated/errorDetails.mjs";
import { fastifyTelemetry } from "./fastifyTelemetry.mjs";
import { fastifyGraphql } from "./fastifyGraphql.mjs";
import { newApiContext } from "../interfaces/apiContext.mjs";

function createFastify() {
  // Create Fastify instance
  const fastify = Fastify({
    ...loggerOptions,
    ajv: { customOptions: { ...ajvDefaultOptions } },
    genReqId: () => nanoid(21),
  });

  fastify.get("/favicon.ico", { logLevel: "error" }, (request, reply) => {
    reply.code(204).send();
  });

  // **************************************************************** onRequest
  fastify.addHook("onRequest", async (request, response) => {
    request.apiContext = newApiContext(request, response);
  });

  // **************************************************************** @fastify/jwt
  // Register Fastify authentication plugin
  const jwtOptions: FastifyJWTOptions = {
    // Use environment option 'JWT_SECRET' with an actual secure value in production
    secret: environment.jwtSecret,
  };

  fastify.register(fastifyJwt, jwtOptions);

  // JWT Sign and Verify Helpers
  fastify.decorate("authenticate", authMiddleware);

  // **************************************************************** @fastify/cors
  const corsOptions: FastifyCorsOptions = {
    origin: environment.corsOrigin?.split(";") ?? ["*"], // Allow specific origins
    methods: ["post", "put", "delete", "patch", "head"], // Allow specific HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
    credentials: true, // Allow credentials (e.g., cookies, authorization headers)
    maxAge: 86400, // Cache preflight request response for 1 day (in seconds)$
  };

  fastify.register(fastifyCors, corsOptions);

  // **************************************************************** @fastify/rate-limit

  const rateLimitOptions: RateLimitPluginOptions = {
    max: 100, // Max number of requests per time window
    timeWindow: 60 * 1000, // Time window for the rate limit
    // Use the token or IP as the unique identifier for rate limiting
    keyGenerator: (request: FastifyRequest) => request.headers["authorization"] ?? request.ip,
    errorResponseBuilder: (request: FastifyRequest, context: errorResponseBuilderContext): ErrorDetails => ({
      statusCode: 429,
      message: "Too Many Requests",
      issues: [`Rate limit exceeded (${context.max}).`],
    }),
  };

  fastify.register(fastifyRateLimit, rateLimitOptions);

  // **************************************************************** @fastify/helmet

  const helmetOptions: FastifyHelmetOptions = {
    contentSecurityPolicy: {
      useDefaults: true,
    },
  };

  fastify.register(fastifyHelmet, helmetOptions);

  // **************************************************************** @swagger
  const swaggerOptions: SwaggerOptions & FastifyStaticSwaggerOptions = {
    mode: "static",
    // exposeRoute: true,
    specification: {
      document: openApiSpec, // Directly pass the in-memory OpenAPI JSON
    } as unknown as StaticDocumentSpec,
  };

  // Register Swagger plugin for API documentation
  fastify.register(fastifySwagger, swaggerOptions);

  // **************************************************************** @swagger-ui
  const swaggerUiOptions: FastifySwaggerUiOptions = {
    routePrefix: "/docs",
    staticCSP: true,
    uiConfig: {
      deepLinking: false,
    },
  };

  fastify.register(fastifySwaggerUi, swaggerUiOptions);

  // **************************************************************** @fastify/response-validation
  const responseValidationOptions: FastifyResponseValidationOptions = {
    ajv: createAjv({ removeAdditional: false }),
    responseValidation: true,
    responseStatusCodeValidation: true,
  };

  fastify.register(fastifyResponseValidation, responseValidationOptions);

  // **************************************************************** fastify-openapi-glue
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

  // **************************************************************** graphql/graphiql

  fastifyGraphql(fastify);

  // **************************************************************** open-telemetry

  if (environment.openTelemetry) {
    fastifyTelemetry(fastify);
  }

  // **************************************************************** onError
  // Error handler
  fastify.setErrorHandler(errorHandler);

  // ****************************************************************
  return fastify;
}

export const fastify = createFastify();
