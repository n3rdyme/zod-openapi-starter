/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { FastifyReply, FastifyRequest } from "fastify";
import { InternalServerError, NotImplementedError } from "./errors.mjs";
import { ApiContext } from "../interfaces/apiContext.mjs";

const loadedFunctions: { [key: string]: Function | { error: any } } = {};
/**
 * Entrypoint for all fastify handlers, calls the implementation method and sends the response or throws an error
 *
 * @param request The fastify request object
 * @param response The fastify response object
 * @param impl The implementation method
 * @param api The api definition object
 * @returns A fastify handler function that calls the implementation method
 */
export const fastifyStub = (
  name: string,
  impl: () => Promise<{ [key: string]: Function }>,
  successCodeText: string,
  contentType: string,
) => {
  return async (request: FastifyRequest, response: FastifyReply) => {
    return await request.log.span("stub:" + name, { name, successCodeText, contentType }, async () => {
      const func =
        loadedFunctions[name] ??
        (loadedFunctions[name] = await impl()
          .then((mod) => mod[name])
          .catch((error) => ({ error })));
      if (!func) {
        throw new NotImplementedError(`Function ${name} not implemented`);
      }
      if (typeof func !== "function") {
        if (func?.error) {
          console.error(func.error);
        }
        throw new InternalServerError(`Function ${name} is not a function`);
      }
      const statusCode = parseInt(`${successCodeText}`, 10);
      if (!(statusCode >= 200 && statusCode < 300)) {
        throw new InternalServerError(`Invalid success code  ${name}:${successCodeText}`);
      }

      if (!request.apiContext) {
        throw new InternalServerError("API Context not initialized");
      }

      const context: ApiContext = {
        ...request.apiContext,
        name,
        statusCode,
        contentType: contentType || "application/json",
      };

      const result = await context.logger.span("call:" + name, {}, () =>
        func(Object.assign({}, request.query, request.params, request.body), context),
      );

      response.status(statusCode);
      if (statusCode === 204) {
        // no content or content-type for 204
        return response.send();
      }

      if (!result) {
        throw new InternalServerError(`Function ${name} did not return a value`);
      }
      if (contentType) {
        response.header("Content-Type", contentType);
      }
      response.send(result);
    });
  };
};
