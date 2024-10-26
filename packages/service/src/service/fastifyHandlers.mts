/* eslint-disable */
import { FastifyRequest, FastifyReply } from "fastify";
import { fastifyStub } from "./fastifyStub.mjs";

export const fastifyHandlers: { [key: string]: (req: FastifyRequest, res: FastifyReply) => unknown } = {
  createTodo: (req, response) => fastifyStub(req, response, import("../handlers/createTodo.mjs"), {"name":"createTodo","successCode":"201","contentType":"application/json"}),
  getTodos: (req, response) => fastifyStub(req, response, import("../handlers/getTodos.mjs"), {"name":"getTodos","successCode":"200","contentType":"application/json"}),
  updateTodo: (req, response) => fastifyStub(req, response, import("../handlers/updateTodo.mjs"), {"name":"updateTodo","successCode":"200","contentType":"application/json"}),
  deleteTodo: (req, response) => fastifyStub(req, response, import("../handlers/deleteTodo.mjs"), {"name":"deleteTodo","successCode":"204","contentType":"application/json"}),
};
