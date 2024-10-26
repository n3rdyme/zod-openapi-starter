import { FastifyRequest } from "fastify";

// Create a custom Pino configuration
export const customLogger = {
  level: "info", // Set the log level
  transport: {
    target: "pino-pretty", // Optional, for pretty-printing logs
    options: {
      colorize: true,
      colorizeObjects: true,
      translateTime: "HH:MM:ss",
      ignore: "pid,hostname,responseTime",
    },
  },
  // Custom serializers can be added here
  serializers: {
    req(request: FastifyRequest) {
      return { method: request.method, url: request.url, query: request.query }; // Custom request logging
    },
  },
};
