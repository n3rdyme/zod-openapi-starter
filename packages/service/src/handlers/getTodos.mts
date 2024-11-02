import type { ApiContext } from "../middleware/requestContext.mjs";
import { TodoItemList } from "../generated/index.mjs";

export type GetTodosParams = {
  completed?: boolean;
};

/**
 * Retrieve a list of to-do items
 */
export const getTodos = async (request: GetTodosParams, context: ApiContext): Promise<TodoItemList> => {
  return {
    items: [
      {
        id: "999d6b59-b317-74d1-c696-9256c0af0b7c",
        title: "eu occaecat eiusmod do",
        description: "ullamco dolor commodo enim",
        completed: false,
      },
      {
        id: "2e14b842-310e-d8ad-1230-44df512a1788",
        title: "eu in nostrud",
        description: "ea tempor pariatur nostrud",
        completed: true,
      },
      {
        id: "cd61ffa8-7d9e-4c39-03d9-2662f7a2cc26",
        title: "laborum culpa ipsum proident ut",
        completed: true,
      },
    ],
  };
};
