import type { ApiContext } from "../../interfaces/apiContext.mjs";
import { CreateTodoRequest, TodoItem } from "../../generated/index.mjs";
import { todoStoreCreate } from "../../repositories/todoStore.mjs";
/**
 * Create a new to-do item
 */
export const createTodo = async (request: CreateTodoRequest, context: ApiContext): Promise<TodoItem> => {
  const item = await todoStoreCreate({ ...request, completed: false }, context);
  context.logger.info(item, "Created a new to-do item");
  return item;
};
