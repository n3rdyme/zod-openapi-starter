import type { ApiContext } from "../middleware/requestContext.mjs";
import { TodoItem, UpdateTodoRequest } from "../generated/index.mjs";
/**
 * Update an existing to-do item by ID
 */
export const updateTodo = async (
  request: { id: string } & UpdateTodoRequest,
  context: ApiContext,
): Promise<TodoItem> => {
  return {
    id: "f2ec6591-6114-a1f6-a91a-9cf9c4269296",
    title: "ex veniam voluptate dolore",
    description: "amet quis",
    completed: false,
  };
};
