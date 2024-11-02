import { FastifyBaseLogger, FastifyReply, FastifyRequest } from "fastify";
import { UserToken } from "./userToken.mjs";

export interface ApiContext {
  name: string;
  statusCode: number;
  contentType: string;

  request: FastifyRequest;
  response: FastifyReply;

  logger: FastifyBaseLogger;

  user: UserToken;
}

declare module "fastify" {
  interface FastifyRequest {
    apiContext?: ApiContext;
  }
}
