import type { ApiContext } from "../middleware/requestContext.mjs";
import { CreateTodoRequest, TodoItem } from "../generated/index.mjs";
/**
 * Create a new to-do item
 */
export const createTodo = async (request: CreateTodoRequest, context: ApiContext): Promise<TodoItem> => {
  return {
    id: "646c1787-7c0a-6250-f1d8-fa8e77325aa3",
    title: "incididunt",
    description: "sed ullamco irure proident",
    completed: true,
  };
};
