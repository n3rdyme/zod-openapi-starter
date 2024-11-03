import { z } from "zod";

export const EnvironmentDataSchema = z
  .object({
    env: z.enum(["production", "development", "test"]),
    logLevel: z.enum(["debug", "info", "warn", "error"]),
    port: z.number(),
    host: z.string().optional(),
    jwtSecret: z.string().min(21),
    corsOrigin: z.string().optional(),
    openTelemetry: z.boolean().optional(),
  })
  .openapi("EnvironmentData");
