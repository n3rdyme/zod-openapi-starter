/*
 * Taken from https://github.com/open-telemetry/opentelemetry-js-contrib/blob/main/examples/fastify/opentelemetry.js
 */

/* eslint-disable no-undef */
import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.WARN);

import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { FastifyInstrumentation } from "@opentelemetry/instrumentation-fastify";

import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-proto";
import { NodeSDK, metrics } from "@opentelemetry/sdk-node";

process.env.OTEL_SERVICE_NAME = "local-service";

const sdk = new NodeSDK({
  instrumentations: [new HttpInstrumentation(), new FastifyInstrumentation()],
  traceExporter: new OTLPTraceExporter(),
  metricReader: new metrics.PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter(),
  }),
});

process.on("beforeExit", async () => {
  await sdk.shutdown();
});

sdk.start();
