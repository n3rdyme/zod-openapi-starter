import { FastifyBaseLogger, FastifyReply, FastifyRequest } from "fastify";

export interface ApiContext {
  name: string;
  statusCode: number;
  contentType: string;

  request: FastifyRequest;
  response: FastifyReply;

  logger: FastifyBaseLogger;
}
