/* eslint-disable */
type ServerStubFactory<T extends Function> = (
  name: string,
  impl: () => Promise<{ [key: string]: Function }>,
  successCode: string,
  contentType: string,
) => T;

export const getHandlers = <T extends Function>(factory: ServerStubFactory<T>): { [key: string]: T } => ({
  login: factory("login", () => import("./auth/login.mjs"), "200", "application/json"),
  createTodo: factory("createTodo", () => import("./todos/createTodo.mjs"), "201", "application/json"),
  getTodos: factory("getTodos", () => import("./todos/getTodos.mjs"), "200", "application/json"),
  updateTodo: factory("updateTodo", () => import("./todos/updateTodo.mjs"), "200", "application/json"),
  deleteTodo: factory("deleteTodo", () => import("./todos/deleteTodo.mjs"), "204", "application/json"),
});
