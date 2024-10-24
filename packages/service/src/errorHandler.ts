import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';

export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  request.log.error(error);
  reply.status(error.statusCode || 500).send({
    code: error.statusCode || 500,
    message: error.message,
    issues: error.validation || [],
    data: error.data || null,
  });
}
