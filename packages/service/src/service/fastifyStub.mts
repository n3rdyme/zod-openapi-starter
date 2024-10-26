import { FastifyReply, FastifyRequest } from "fastify";

export const fastifyStub = async (
  request: FastifyRequest,
  reply: FastifyReply,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  impl: Promise<{ [key: string]: Function }>,
  {
    name,
    successCode,
    contentType,
  }: {
    name: string;
    successCode?: string | number;
    contentType?: string;
  },
) => {
  const func = await impl.then((mod) => mod[name]).catch((error) => ({ error }));
  if (!func) {
    return reply
      .status(404)
      .header("Content-Type", "application/json")
      .send({ error: `Function ${name} not implemented` });
  }
  if (typeof func !== "function") {
    return reply
      .status(500)
      .header("Content-Type", "application/json")
      .send({ error: func.error ?? `Function ${name} is not a function` });
  }

  const result = await func(Object.assign({}, request.query, request.params, request.body), { request, reply });

  if (successCode) {
    reply.status(parseInt(`${successCode}`, 10));
  }
  if (contentType) {
    reply.header("Content-Type", contentType);
  }
  reply.send(result);
};
