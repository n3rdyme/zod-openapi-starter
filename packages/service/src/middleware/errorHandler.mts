import { FastifyError, FastifyRequest, FastifyReply } from "fastify";

export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply): void {
  if (error) {
    reply.log.error(error);
  }
  reply.status(error.statusCode || 500).send({
    statusCode: error.statusCode || 500,
    code: error.code,
    message: error.message,
    issues: error.validation || [],
    // data: error.data || null,
  });
}
