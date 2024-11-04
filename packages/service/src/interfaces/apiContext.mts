import { FastifyBaseLogger, FastifyReply, FastifyRequest } from "fastify";
import { UserToken } from "./userToken.mjs";

export type ApiRequest = Pick<
  FastifyRequest,
  "method" | "url" | "headers" | "body" | "params" | "query" | "log" | "apiContext"
>;
export type ApiResponse = Pick<FastifyReply, "headers" | "send" | "status" | "log">;

export interface ApiContext {
  name: string;
  statusCode: number;
  contentType: string;

  request: ApiRequest;
  response: ApiResponse;

  logger: FastifyBaseLogger;

  user: UserToken;
}

declare module "fastify" {
  interface FastifyRequest {
    apiContext?: ApiContext;
  }
}

export function newApiContext(request: ApiRequest, response: ApiResponse): ApiContext {
  return {
    name: `${request.method} ${request.url}`,
    statusCode: 200,
    contentType: "application/json",
    request,
    response,
    logger: response.log,
    user: {
      id: "",
      username: "",
      timestamp: 0,
      roles: [],
    },
  };
}
