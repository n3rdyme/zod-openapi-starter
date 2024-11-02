/* eslint-disable @typescript-eslint/no-explicit-any */
import { OpenAPIRegistry, RouteConfig } from "@asteasolutions/zod-to-openapi";
import { RouteParameter, ZodRequestBody } from "@asteasolutions/zod-to-openapi/dist/openapi-registry";
import { z, ZodObject, type ZodTypeAny } from "zod";

interface ApiEndpointRequest {
  description?: string;
  schema: Exclude<RouteParameter, undefined>;
  contentType?: string;
}

interface ApiEndpointResponseContent {
  description?: string;
  statusCode?: 200 | 201 | 202 | 203 | 205 | 206;
  schema: ZodTypeAny;
  contentType?: string;
}

type ApiEndpointResponseNoContent = Omit<ApiEndpointResponseContent, "statusCode" | "schema" | "contentType"> & {
  statusCode: 204;
};
type ApiEndpointResponse = ApiEndpointResponseContent | ApiEndpointResponseNoContent;

interface ApiEndpointFull {
  name: string;
  description?: string;
  method: Exclude<RouteConfig["method"], "get">;
  path: string;
  request?: RouteParameter | ApiEndpointRequest;
  query?: RouteParameter;
  response?: 204 | ZodTypeAny | ApiEndpointResponse;
}
interface ApiEndpointGet extends Omit<ApiEndpointFull, "method" | "request"> {
  method: "get";
}

export type ApiEndpoint = ApiEndpointFull | ApiEndpointGet;

declare module "@asteasolutions/zod-to-openapi" {
  interface OpenAPIRegistry {
    registerApi(api: ApiEndpoint): void;
  }
}

const getErrors = () => {
  const ErrorSchema = z
    .object({
      statusCode: z.number().int().openapi({ format: "int32" }),
      code: z.string().optional(),
      message: z.string().default("Unknown Error"),
      issues: z.array(z.any()).optional(),
      data: z.any().optional(),
    })
    .openapi("ErrorDetails");

  const code4xx: number = "4XX" as unknown as number;
  const code5xx: number = "5XX" as unknown as number;

  return {
    [code5xx]: {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
    [code4xx]: {
      description: "Invalid Request Error",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  };
};

function repositoryRegisterApi(this: OpenAPIRegistry, api: ApiEndpoint) {
  const {
    schema: requestSchemaFull,
    description: requestDesc,
    contentType: requestType,
  } = (
    ((api as ApiEndpointFull).request as ZodTypeAny)?.constructor?.name?.startsWith?.("Zod")
      ? { schema: (api as ApiEndpointFull).request }
      : ((api as ApiEndpointFull).request ?? {})
  ) as ApiEndpointRequest;

  let requestSchema: ZodObject<any> | undefined = requestSchemaFull as ZodObject<any>;
  let paramsSchema: ZodObject<any> | undefined;
  const params: string[] = [];
  api.path.replace(/\/{([\w]+)}(\/|$)/g, (_, m1) => params.push(m1) && m1);
  if (params.length > 0) {
    if (!requestSchema) {
      throw new Error(`Missing request schema for path parameters in ${api.name} (${api.method} ${api.path})`);
    }
    const missingParams = params.filter((param) => !requestSchema?.shape?.[param]);
    if (missingParams.length > 0) {
      throw new Error(
        `Missing path parameter(s): ${missingParams.join(", ")} in ${api.name} (${api.method} ${api.path})`,
      );
    }
    const bodyParams = Object.keys(requestSchema.shape).filter((param) => !params.includes(param));
    const paramMask = params.reduce((acc, param) => ({ ...acc, [param]: true }), {});
    paramsSchema = requestSchema.pick(paramMask).openapi({});

    if (bodyParams.length > 0) {
      const openapiArgs = requestSchema._def.openapi;
      requestSchema = requestSchema.omit(paramMask);
      requestSchema._def.openapi = openapiArgs;
    } else {
      requestSchema = undefined;
    }
  }

  const {
    schema: responseSchema,
    description: responseDesc,
    contentType: responseType,
    statusCode = 200,
  } = (
    api.response === 204
      ? { statusCode: 204 }
      : (api.response as ZodTypeAny)?.constructor?.name?.startsWith?.("Zod")
        ? { schema: api.response }
        : (api.response ?? {})
  ) as ApiEndpointResponseContent;

  const routeConfig: RouteConfig = {
    method: api.method,
    path: api.path,
    operationId: api.name,
    description: api.description,
    request: Object.assign(
      {},
      !requestSchema
        ? {}
        : {
            body: {
              required: true,
              description: requestDesc,
              content: { [requestType ?? "application/json"]: { schema: requestSchema } },
            } as ZodRequestBody,
          },
      !paramsSchema ? {} : { params: paramsSchema },
      !api.query ? {} : { query: api.query },
    ),
    responses: {
      [statusCode]: {
        description: responseDesc ?? "Success response",
        ...(!responseSchema
          ? {}
          : {
              content: {
                [responseType ?? "application/json"]: {
                  schema: responseSchema,
                },
              },
            }),
      },
      ...getErrors(),
    },
  };

  this.registerPath(routeConfig);
}

export function hookRepositoryRegisterApi(registry: OpenAPIRegistry) {
  registry.constructor.prototype.registerApi = repositoryRegisterApi;
  return registry;
}
