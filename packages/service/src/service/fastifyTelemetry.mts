import { FastifyInstance } from "fastify";
import api from "@opentelemetry/api";

export function fastifyTelemetry(fastify: FastifyInstance): void {
  fastify.log.debug("Telemetry enabled");

  fastify.addHook("onRequest", async () => {
    const span = api.trace.getSpan(api.context.active());
    span?.setAttribute("order", 2);
  });
}
