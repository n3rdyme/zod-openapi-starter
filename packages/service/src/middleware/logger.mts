import { FastifyRequest, FastifyServerOptions } from "fastify";
import { environment } from "../environment.mjs";

// Create a custom Pino configuration
export const loggerOptions: FastifyServerOptions["logger"] = {
  // Set the log level
  level: environment.logLevel,

  // Environment-specific options
  ...(environment.env === "production"
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
