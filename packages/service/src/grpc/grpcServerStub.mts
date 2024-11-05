import { type sendUnaryData, type ServerUnaryCall, type ServiceDefinition } from "@grpc/grpc-js";
import type { OpenAPIV3 } from "openapi-types";
import { GrpcResponse } from "./grpcResponse.mjs";
import {
  BadRequestError,
  InternalServerError,
  NotImplementedError,
  UnauthorizedError,
  UnrecoverableError,
} from "../service/errors.mjs";
import type { Ajv } from "ajv";
import { nanoid } from "nanoid";
import { createAjv } from "../middleware/ajv-validation.mjs";
import { ApiContext, ApiRequest, newApiContext } from "../interfaces/apiContext.mjs";
import { getHandlers } from "../handlers/index.mjs";
import { fastify } from "../service/fastifyService.mjs";
import { FastifyRequest } from "fastify";

type ValidateObject = <T>(obj: T) => T;

export type GrpcEventArgs = {
  name: string;
  context: ApiContext;
  call: ServerUnaryCall<any, any>;
  operation: OpenAPIV3.OperationObject;
  schema: OpenAPIV3.Document;
};

type GrpcServerOperation = {
  name: string;
  schema: OpenAPIV3.OperationObject;
  requestValidation?: ValidateObject;
  responseValidation?: ValidateObject;
};

export class GrpcServerStub {
  readonly stubs: {
    [key: string]: <RequestType, ResponseType>(
      call: ServerUnaryCall<RequestType, ResponseType>,
      callback: sendUnaryData<ResponseType>,
    ) => void;
  } = {};
  private $operations: {
    [key: string]: GrpcServerOperation;
  } = {};
  private readonly ajv: Ajv;
  private $loadedFunctions: { [key: string]: Function | { error: any } } = {};
  private $dispatchHandler: { [key: string]: (request: ApiRequest, context: ApiContext) => Promise<unknown> };

  constructor(
    private readonly service: ServiceDefinition,
    private readonly spec: OpenAPIV3.Document,
  ) {
    this.ajv = createAjv();
    Object.entries(this.spec.components?.schemas ?? {}).forEach(([key, schema]) => {
      this.ajv.addSchema(schema, `#/components/schemas/${key}`);
    });

    for (const [path, pathItem] of Object.entries(this.spec.paths)) {
      for (const [method, operation] of Object.entries(pathItem ?? {})) {
        if (typeof operation === "object" && "operationId" in operation) {
          const name = operation.operationId ?? `${method} ${path}`;
          this.$operations[name] = {
            name,
            schema: operation as OpenAPIV3.OperationObject,
          };
        }
      }
    }

    const lookup = Object.entries(this.service).reduce(
      (lookup, [name, value]: any) => {
        lookup[name] = value;
        lookup[value.originalName] = value;
        return lookup;
      },
      {} as { [key: string]: any },
    );
    for (const [name, svcCall] of Object.entries(lookup)) {
      const origName = svcCall.originalName ?? name;
      this.stubs[name] = (call, callback) => this.$handleCall(origName, call, callback);
    }
    Object.freeze(this.stubs);

    this.$dispatchHandler = getHandlers(this.$handlerFactory);
  }

  private $handleCall<RequestType, ResponseType>(
    name: string,
    call: ServerUnaryCall<RequestType, ResponseType>,
    callback: sendUnaryData<ResponseType>,
  ) {
    const requestId = this.genReqId();
    const log = fastify.log.child({ reqId: requestId, operation: name });
    log.span(`grpc:${name}`, { method: "grpc", operation: name }, async () => {
      const response = new GrpcResponse(log, call, callback);
      response.header("x-request-id", requestId);
      try {
        return this.$dispatchCall(requestId, name, call, response)
          .catch((error) => {
            response.sendError(error);
          })
          .finally(() => {
            // Ensure that the response is sent
            response.sendError(new UnrecoverableError());
          });
      } catch (error) {
        response.sendError(error);
      }
    });
  }

  public genReqId = () => nanoid(21);
  public onBeforeCall?: (arg: GrpcEventArgs) => Promise<void> | void;
  public onAfterCall?: (arg: GrpcEventArgs, response: unknown) => Promise<void> | void;
  public onHandleError?: (arg: GrpcEventArgs, error: Error) => Promise<void> | void = ({ name, context }, error) => {
    context.logger.error(error, `Error in ${name}`);
  };

  private async $dispatchCall<RequestType, ResponseType>(
    requestId: string,
    name: string,
    call: ServerUnaryCall<RequestType, ResponseType>,
    response: GrpcResponse,
  ) {
    const operation = this.$operations[name];
    if (!operation) {
      throw new NotImplementedError("Unable to find operation: " + name);
    }
    if (!operation.requestValidation || !operation.responseValidation) {
      operation.requestValidation = this.$prepareSchema(
        (operation.schema.requestBody as any)?.schema ||
          (operation.schema.requestBody as any)?.content?.["application/json"]?.schema,
      );
      const key = Object.keys(operation.schema.responses ?? {}).find((k) => k === "default" || k.startsWith("2"));
      operation.responseValidation = this.$prepareSchema(
        key &&
          ((operation.schema.responses?.[key] as any)?.schema ||
            (operation.schema.responses?.[key] as any)?.content?.["application/json"]?.schema),
      );
    }
    const fauxRequest: ApiRequest = {
      method: "grpc",
      id: requestId,
      url: name,
      log: response.log,
      routeOptions: this.$routeOptions(operation),
      body: operation.requestValidation(call.request),
      params: {},
      query: {},
      headers: call.metadata.getMap() as any,
      jwtVerify: async () => {
        const [, token] = `${call.metadata.get("authorization")?.[0]}`.match(/^Bearer\s+(.+)$/) ?? [];
        if (!token) {
          throw new UnauthorizedError();
        }
        return fastify.jwt.verify(token);
      },
    };

    fauxRequest.apiContext = newApiContext(fauxRequest, response as any);

    const eventArg: GrpcEventArgs = {
      name,
      context: fauxRequest.apiContext,
      call,
      operation: operation.schema,
      schema: this.spec,
    };

    try {
      await Promise.resolve(this.onBeforeCall?.(eventArg));

      const handler = this.$dispatchHandler[name];
      if (!handler) {
        throw new NotImplementedError(`Handler not implemented: ${name}`);
      }

      const result = await handler(fauxRequest, fauxRequest.apiContext);

      await Promise.resolve(this.onAfterCall?.(eventArg, result));

      const validated = operation.responseValidation(result);
      response.send(validated);
    } catch (error) {
      await Promise.resolve(this.onHandleError?.(eventArg, error));
      throw error;
    }
  }

  $routeOptions({ name, schema }: GrpcServerOperation): Readonly<FastifyRequest["routeOptions"]> {
    return {
      attachValidation: true,
      schema: schema,
      bodyLimit: 4194304,
      config: {
        method: "grpc" as any,
        url: name,
      },
      exposeHeadRoute: false,
      handler: this.$dispatchHandler[name] as any,
      method: "grpc",
      url: name,
      logLevel: fastify.log.level,
      prefixTrailingSlash: "",
    };
  }

  private $handlerFactory = (name: string, impl: () => Promise<unknown>) => {
    return async (request: ApiRequest, context: ApiContext) => {
      try {
        const func =
          this.$loadedFunctions[name] ??
          (this.$loadedFunctions[name] = await impl()
            .then((mod: any) => mod[name])
            .catch((error) => ({ error })));

        if (!func || typeof func !== "function") {
          throw new NotImplementedError(`Function not implemented`, {
            issues: [
              func.error ? `Error in function ${name}: ${func.error}` : `The function ${name} is not implemented`,
            ],
          });
        }

        return await context.logger.span(`call:${name}`, {}, () => func(request.body, context));
      } catch (error) {
        if (!error.grpcCode) {
          throw new InternalServerError("An error occurred while processing the request", {
            data: {
              type: error.name,
              message: error.message,
              stack: error.stack,
            },
          });
        }
        throw error;
      }
    };
  };

  private $prepareSchema(schema: any): ValidateObject {
    if (!schema) {
      return <T = unknown,>() => ({}) as T;
    }

    const validate = this.ajv.compile(schema);
    return (result) => {
      result = result === undefined ? undefined : JSON.parse(JSON.stringify(result));
      if (!validate(result)) {
        throw new BadRequestError("Invalid request", {
          issues: (validate.errors?.map((i) => i.message).filter(Boolean) as string[]) ?? [],
        });
      }
      return result;
    };
  }
}
