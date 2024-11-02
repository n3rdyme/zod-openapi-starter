import { FastifyRequest, FastifyServerOptions } from "fastify";

const isProduction = process.env.NODE_ENV === "production";
const logLevel = process.env.LOG_LEVEL ?? (isProduction ? "info" : "debug");

// Create a custom Pino configuration
export const loggerOptions: FastifyServerOptions["logger"] = {
  // Set the log level
  level: logLevel,

  // Environment-specific options
  ...(isProduction
    ? {}
    : {
        // Use pretty-printing in development
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            colorizeObjects: true,
            translateTime: "HH:MM:ss",
            ignore: "pid,hostname,responseTime",
          },
        },
      }),

  // Custom serializers for additional logging context
  serializers: {
    req(request: FastifyRequest) {
      return { method: request.method, url: request.url, query: request.query }; // Custom request logging
    },
  },
};
