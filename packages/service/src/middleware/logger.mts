import { FastifyBaseLogger, FastifyRequest, FastifyServerOptions } from "fastify";
import pino, { Bindings, ChildLoggerOptions } from "pino";
import api, { Span } from "@opentelemetry/api";
import { environment } from "../environment.mjs";

declare module "fastify" {
  interface FastifyBaseLogger {
    span: <T>(name: string, data: Record<string, unknown>, func: () => Promise<T>) => Promise<T>;
  }
}

async function span<T>(this: FastifyBaseLogger, name: string, data: Record<string, unknown>, func: () => Promise<T>) {
  let newSpan: Span | undefined;
  try {
    newSpan = api.trace?.getTracer?.(`${name}`)?.startSpan(name);
    newSpan?.setAttributes(
      Object.entries(data).reduce(
        (acc, [key, value]) => {
          if (value == null) {
            // ignore
          } else if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
            acc[key] = value;
          } else if (typeof value === "object") {
            acc[key] = JSON.stringify(value);
          }
          return acc;
        },
        {} as { [key: string]: string | number | boolean },
      ),
    );

    if (!newSpan) {
      return await func();
    }

    return await api.context.with(api.trace?.setSpan(api.context.active(), newSpan), func);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    newSpan?.recordException({
      code: error.code ?? error.statusCode,
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
    throw error;
  } finally {
    newSpan?.end();
  }
}

function overridePinoLogger(pinoLogger: FastifyBaseLogger) {
  const pinoChild = pinoLogger.child;
  const makeChild = function child(this: pino.BaseLogger, bindings: Bindings, options?: ChildLoggerOptions) {
    const child = pinoChild.apply(this, [bindings, options]);
    child.span = pinoLogger.span;
    child.child = makeChild;
    return child;
  };

  pinoLogger.span = span;
  pinoLogger.child = makeChild;
  return pinoLogger;
}

function setupLoggerOptions(): Pick<FastifyServerOptions, "logger" | "loggerInstance"> {
  const options: FastifyServerOptions["logger"] = {
    // Set the log level
    level: environment.logLevel,

    customLevels: {
      span: 1, // Lowest log level
    },

    hooks: {
      logMethod(args, method) {
        if (args[0] === "span") {
          console.log("span", args);

          return args[2];
          // return args;
        }
        return method.apply(this, args);
      },
    },

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

  const pinoLogger = overridePinoLogger(pino(options) as unknown as FastifyBaseLogger);

  return {
    loggerInstance: pinoLogger,
  };
}

// Create a custom Pino configuration
export const loggerOptions = setupLoggerOptions();
