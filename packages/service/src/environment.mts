import { EnvironmentData } from "./generated/environmentData.mjs";
import openapi from "@local/api";
import { createAjv } from "./middleware/ajv-validation.mjs";

function loadEnvironmentData(): EnvironmentData {
  const ajv = createAjv();
  const validate = ajv.compile<EnvironmentData>(openapi.components.schemas.EnvironmentData);

  const envData: Partial<EnvironmentData> = {
    env: (process.env.NODE_ENV ?? "development") as EnvironmentData["env"],
    logLevel: (process.env.LOG_LEVEL ?? "debug") as EnvironmentData["logLevel"],
    port: parseInt(process.env.PORT || process.env.NODE_PORT || "3000"),
    jwtSecret: process.env.JWT_SECRET,
    corsOrigin: process.env.CORS_ORIGIN,
  };

  if (envData.env !== "production") {
    envData.host = "localhost";
    envData.jwtSecret = "Ash stnazg durbatulûk, ash nazg gimbatul";
  }
  console.log("OTEL_SERVICE_NAME", process.env.OTEL_SERVICE_NAME);
  if (process.env.OTEL_SERVICE_NAME) {
    envData.openTelemetry = true;
  }

  if (!validate(envData)) {
    throw new Error(`Invalid environment data: ${JSON.stringify(validate.errors)}`);
  }

  return envData as EnvironmentData;
}

export const environment = loadEnvironmentData();