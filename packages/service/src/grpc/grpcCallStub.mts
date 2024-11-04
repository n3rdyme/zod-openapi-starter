/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendUnaryData, ServerUnaryCall, status, ServiceError, Metadata } from "@grpc/grpc-js";
import { FastifyBaseLogger } from "fastify";
import { ApiRequest, ApiResponse, newApiContext } from "../interfaces/apiContext.mjs";
import { fastifyHandlers } from "../service/fastifyHandlers.mjs";
import { fastify } from "../service/fastifyService.mjs";
import { HttpHeader } from "fastify/types/utils";

export type TCall = <RequestType, ResponseType>(
  call: ServerUnaryCall<RequestType, ResponseType>,
  callback: sendUnaryData<ResponseType>,
) => void;

class GrpcResponse {
  private statusCode: number;
  private headers: Partial<Record<HttpHeader, number | string | string[] | undefined>> = {};

  constructor(
    public readonly log: FastifyBaseLogger,
    private callback: sendUnaryData<any>,
  ) {
    this.statusCode = 200;
  }

  header(key: HttpHeader, value?: string): GrpcResponse {
    this.headers[key] = value;
    return this;
  }

  status = (statusCode: number): GrpcResponse => {
    this.statusCode = statusCode;
    return this;
  };

  send = (payload?: unknown): GrpcResponse => {
    if (this.statusCode < 200 || this.statusCode >= 300) {
      const error: ServiceError = {
        name: "INTERNAL",
        code: status.INTERNAL,
        message: "Internal Server Error",
        details: "The status code was not 2xx",
        metadata: new Metadata(),
      };
      this.callback(error);
      this.callback = () => {};
      return this;
    }

    this.callback(null, payload ?? {});
    this.callback = () => {};
    return this;
  };
}

export function grpcCallStub(
  service: any,
  name: string,
  type: any,
  call: Parameters<TCall>[0],
  callback: Parameters<TCall>[1],
) {
  console.log("makeServiceCall", name);
  let req: any = call.request;
  const bodyMessage = type.field.find((field: any) => field.type === "TYPE_MESSAGE");
  if (bodyMessage?.name) {
    const { [bodyMessage.name]: body, ...reqOther } = req;
    req = { ...reqOther, ...body };
  }

  const handler = fastifyHandlers[name];
  if (!handler) {
    const error: ServiceError = {
      name: "UNIMPLEMENTED",
      code: status.UNIMPLEMENTED,
      message: "Method not implemented",
      details: "The handler was not found",
      metadata: call.metadata,
    };
    return callback(error);
  }

  const log = fastify.log.child({ method: "grpc", operation: name });
  const fauxResponse = new GrpcResponse(log, callback) as unknown as ApiResponse;
  const fauxRequest: ApiRequest = {
    method: "grpc",
    url: `/$grpc/${name}`,
    body: req,
    params: {},
    query: {},
    headers: call.metadata.getMap() as any,
    log,
  };

  fauxRequest.apiContext = newApiContext(fauxRequest, fauxResponse);
  handler(fauxRequest as any, fauxResponse as any);
}
