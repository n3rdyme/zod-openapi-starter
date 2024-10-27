import { FastifyError, FastifyRequest, FastifyReply } from "fastify";
import { InternalServerError } from "../service/errors.mjs";

export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply): void {
  if (!error.statusCode) {
    error = new InternalServerError(undefined, { cause: error });
  }
  if (error) {
    reply.log.error(error);
  }
  reply.status(error.statusCode || 500).send({
    statusCode: error.statusCode || 500,
    code: error.code,
    message: error.message,
    issues: error.validation || (error as unknown as { issues: unknown[] }).issues || [],
    data: (error as { data?: unknown })?.data ?? undefined,
    cause: (error as { cause?: unknown })?.cause ?? undefined,
  });
}
