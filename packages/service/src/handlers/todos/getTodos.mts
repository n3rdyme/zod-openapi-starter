import type { ApiContext } from "../../interfaces/apiContext.mjs";
import { TodoItemList } from "../../generated/index.mjs";
import { todoStoreList } from "../../repositories/todoStore.mjs";

export type GetTodosParams = {
  completed?: boolean;
};

/**
 * Retrieve a list of to-do items
 */
export const getTodos = async (request: GetTodosParams, context: ApiContext): Promise<TodoItemList> => {
  return {
    items: await todoStoreList(context, request),
  };
};
