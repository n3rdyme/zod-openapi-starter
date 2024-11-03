import { FastifyInstance } from "fastify";
import api from "@opentelemetry/api";

export function fastifyTelemetry(fastify: FastifyInstance): void {
  fastify.log.debug("Telemetry enabled: http://localhost:16686");

  fastify.addHook("onRequest", async (request) => {
    const span = api.trace.getSpan(api.context.active());
    span?.setAttribute("username", request.apiContext?.user?.username ?? "anonymous");
  });
}
