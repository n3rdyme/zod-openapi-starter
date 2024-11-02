import { FastifyReply, FastifyRequest } from "fastify";
import { InternalServerError, NotImplementedError } from "./errors.mjs";
import { ApiContext } from "../middleware/requestContext.mjs";

export const fastifyStub = async (
  request: FastifyRequest,
  response: FastifyReply,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  impl: Promise<{ [key: string]: Function }>,
  {
    name,
    successCode: successCodeText,
    contentType,
  }: {
    name: string;
    successCode?: string | number;
    contentType?: string;
  },
) => {
  const func = await impl.then((mod) => mod[name]).catch((error) => ({ error }));
  if (!func) {
    throw new NotImplementedError(`Function ${name} not implemented`);
  }
  if (typeof func !== "function") {
    throw new InternalServerError(`Function ${name} is not a function`);
  }
  const statusCode = parseInt(`${successCodeText}`, 10);
  if (!(statusCode >= 200 && statusCode < 300)) {
    throw new InternalServerError(`Invalid success code  ${name}:${successCodeText}`);
  }

  const context: ApiContext = {
    name,
    statusCode,
    contentType: contentType || "application/json",
    request,
    response,
    logger: request.log,
  };

  const result = await func(Object.assign({}, request.query, request.params, request.body), context);

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
};
