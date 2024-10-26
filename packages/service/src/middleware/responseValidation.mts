/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @fastify/response-validation - Fastify plugin to validate response schemas
 * https://github.com/fastify/fastify-response-validation/blob/master/index.js
 *
 * npm package is defective, so we need to use the source code directly...
 * When using responses: { default: {...} } in conjunction with the responseStatusCodeValidation flag,
 * you will always recieve a 500 error with the message "No schema defined for status code Xxx".
 *
 * The original code allowed for 4xx or 5xx status codes to exist; however, the openapi spec
 * states that these are specified as 4XX or 5XX.
 */

import fp from "fastify-plugin";
import { Ajv } from "ajv";
import createError from "@fastify/error";
import { FastifyInstance } from "fastify";
import { type Options as FastifyResponseValidationOptions } from "@fastify/response-validation";

const ReplyValidationFailError = createError("FST_RESPONSE_VALIDATION_FAILED_VALIDATION", "%s", 500);
const NoSchemaDefinedError = createError("FST_RESPONSE_VALIDATION_SCHEMA_NOT_DEFINED", "No schema defined for %s");

function fastifyResponseValidationFn(
  fastify: FastifyInstance,
  opts: FastifyResponseValidationOptions,
  next: (err?: Error) => void,
) {
  let ajv: Ajv;
  if (opts.ajv) {
    ajv = opts.ajv as unknown as Ajv;
  } else {
    const { plugins: ajvPlugins, ...ajvOptions } = Object.assign<any, any>(
      {
        coerceTypes: false,
        useDefaults: true,
        removeAdditional: true,
        allErrors: true,
        plugins: [],
      },
      opts.ajv,
    );

    if (!Array.isArray(ajvPlugins)) {
      next(new Error(`ajv.plugins option should be an array, instead got '${typeof ajvPlugins}'`));
      return;
    }
    ajv = new Ajv(ajvOptions);

    for (const plugin of ajvPlugins as any[]) {
      if (Array.isArray(plugin)) {
        plugin[0](ajv, plugin[1]);
      } else {
        plugin(ajv);
      }
    }
  }

  if (opts.responseValidation !== false) {
    fastify.addHook("onRoute", onRoute);
  }

  function onRoute(routeOpts: any) {
    if (routeOpts.responseValidation === false) return;
    if (routeOpts.schema && routeOpts.schema.response) {
      const responseStatusCodeValidation =
        routeOpts.responseStatusCodeValidation || opts.responseStatusCodeValidation || false;
      routeOpts.preSerialization = routeOpts.preSerialization || [];
      routeOpts.preSerialization.push(buildHook(routeOpts.schema.response, responseStatusCodeValidation));
    }
  }

  function buildHook(schema: any, responseStatusCodeValidation: any) {
    const statusCodes: any = {};
    for (const originalCode in schema) {
      const statusCode = originalCode.toUpperCase(); // Ensure status code is uppercase for 4xx and 5xx, etc.
      const responseSchema = schema[statusCode];

      if (responseSchema.content !== undefined) {
        statusCodes[statusCode] = {};
        for (const mediaName in responseSchema.content) {
          statusCodes[statusCode][mediaName] = ajv.compile(getSchemaAnyway(responseSchema.content[mediaName].schema));
        }
      } else {
        statusCodes[statusCode] = ajv.compile(getSchemaAnyway(responseSchema));
      }
    }

    return preSerialization;

    function preSerialization(req: any, reply: any, payload: any, next: any) {
      let validate =
        statusCodes[reply.statusCode] || statusCodes[(reply.statusCode + "")[0] + "XX"] || statusCodes.DEFAULT;

      if (responseStatusCodeValidation && validate === undefined) {
        next(new NoSchemaDefinedError(`status code ${reply.statusCode}`));
        return;
      }

      if (validate !== undefined) {
        // Per media type validation
        if (validate.constructor === Object) {
          const mediaName = reply.getHeader("content-type").split(";", 1)[0];
          if (validate[mediaName] == null) {
            next(new NoSchemaDefinedError(`media type ${mediaName}`));
            return;
          }
          validate = validate[mediaName];
        }

        const valid = validate(payload);
        if (!valid) {
          const err = new ReplyValidationFailError(schemaErrorsText(validate.errors));
          err.validation = validate.errors;
          reply.code(err.statusCode);
          return next(err);
        }
      }

      next();
    }
  }

  next();
}

/**
 * Copy-paste of getSchemaAnyway from fastify
 *
 * https://github.com/fastify/fastify/blob/23371945d01c270af24f4a5b7e2e31c4e806e6b3/lib/schemas.js#L113
 */
function getSchemaAnyway(schema: any) {
  if (schema.$ref || schema.oneOf || schema.allOf || schema.anyOf || schema.$merge || schema.$patch) return schema;
  if (!schema.type && !schema.properties) {
    return {
      type: "object",
      properties: schema,
    };
  }
  return schema;
}

function schemaErrorsText(errors: any) {
  let text = "";
  const separator = ", ";
  for (const e of errors) {
    text += "response" + (e.instancePath || "") + " " + e.message + separator;
  }
  return text.slice(0, -separator.length);
}

export type { FastifyResponseValidationOptions };
export const fastifyResponseValidation = fp(fastifyResponseValidationFn, {
  fastify: "5.x",
  name: "@fastify/response-validation",
});
