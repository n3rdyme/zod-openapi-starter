import type { ApiContext } from "../../interfaces/apiContext.mjs";
import { todoStoreDelete } from "../../repositories/todoStore.mjs";
/**
 * Delete a to-do item by ID
 */
export const deleteTodo = async (request: { id: string }, context: ApiContext): Promise<void> => {
  await todoStoreDelete(request.id, context);
};
