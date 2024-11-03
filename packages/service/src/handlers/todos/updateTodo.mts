import type { ApiContext } from "../../interfaces/apiContext.mjs";
import { TodoItem, UpdateTodoRequest } from "../../generated/index.mjs";
import { todoStoreUpdate } from "../../repositories/todoStore.mjs";
/**
 * Update an existing to-do item by ID
 */
export const updateTodo = async (
  request: { id: string } & UpdateTodoRequest,
  context: ApiContext,
): Promise<TodoItem> => {
  return await todoStoreUpdate(request.id, request, context);
};
