/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendUnaryData, ServiceError, Metadata, status, ServerUnaryCall } from "@grpc/grpc-js";
import { FastifyBaseLogger } from "fastify";
import { HttpHeader } from "fastify/types/utils";
import { ErrorDetails } from "../generated/errorDetails.mjs";
import { UnknownError } from "../service/errors.mjs";

export class GrpcResponse {
  private statusCode: number;
  private metadata: Metadata = new Metadata({});
  private sent?: boolean;

  constructor(
    public readonly log: FastifyBaseLogger,
    private readonly call: ServerUnaryCall<any, any>,
    private callback: sendUnaryData<any>,
  ) {
    this.statusCode = 200;
  }

  header(key: HttpHeader, value?: string): GrpcResponse {
    if (typeof value === "string") {
      this.metadata.add(key, value);
    }
    return this;
  }

  sendError = (reportError: Error): GrpcResponse => {
    if (this.sent) {
      return this;
    }

    const serverError: ServiceError = {
      name: "INTERNAL",
      code: status.INTERNAL,
      message: "Internal Server Error",
      details: "The status code was not 2xx",
      metadata: this.metadata,
    };

    let error = reportError as unknown as {
      grpcCode: number;
      issues?: string[];
      data?: Record<string, unknown>;
      cause: any;
      message: string;
      name: string;
      code: string;
    };
    if (!error.grpcCode) {
      error = new UnknownError(reportError.message, { cause: reportError }) as any;
    }

    serverError.name = error.code;
    serverError.code = error.grpcCode;
    serverError.message = error.name;
    serverError.details = error.message;
    if (error.issues) {
      this.metadata.add("x-error-issues", error.issues.join("\n"));
    }
    if (error.data) {
      this.metadata.add("x-error-data", JSON.stringify(error.data));
    }

    console.log(serverError);
    this.callback(serverError, undefined, this.metadata);
    this.callback = () => {};
    this.sent = true;
    return this;
  };

  status = (statusCode: number): GrpcResponse => {
    this.statusCode = statusCode;
    return this;
  };

  send = (payload?: unknown): GrpcResponse => {
    this.sent = true;

    if (this.statusCode < 200 || this.statusCode >= 300) {
      this.log.error(payload ?? {}, "Error response");
      const serverError: ServiceError = {
        name: "INTERNAL",
        code: status.INTERNAL,
        message: "Internal Server Error",
        details: "Internal Server Error",
        metadata: this.metadata,
      };
      if (this.statusCode >= 400 && payload) {
        const err = payload as ErrorDetails;
        if (err.message) {
          serverError.message = err.message;
          this.metadata.add("x-error-message", err.message);
        }
        if (err.issues) {
          serverError.details = err.issues.join("\n");
          this.metadata.add("x-error-details", err.issues.join("\n"));
        }
      }

      this.callback(serverError, undefined, this.metadata);
      this.callback = () => {};
      return this;
    }

    this.log.info(this.metadata.getMap(), "Response headers");
    this.call.sendMetadata(this.metadata);
    this.callback(null, payload ?? {}, this.metadata);
    this.callback = () => {};
    return this;
  };
}
