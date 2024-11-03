import { nanoid } from "nanoid";
import { TodoItem } from "../generated/todoItem.mjs";
import { ApiContext } from "../interfaces/apiContext.mjs";
import { NotFoundError } from "../service/errors.mjs";

export type TodoItemData = {
  owner: string;
} & TodoItem;

// In-memory storage for todos (private to the module)
const todos: TodoItemData[] = [];

/**
 * Creates a new todo item for the specified user.
 * @param {Omit<TodoItemData, 'id' | 'owner'>} todo - The todo item details without `id` and `owner`.
 * @param {ApiContext} context - The API context containing the user information.
 * @returns {TodoItemData} The newly created todo item.
 */
export async function todoStoreCreate(
  todo: Omit<TodoItemData, "id" | "owner">,
  context: ApiContext,
): Promise<TodoItemData> {
  const newTodo: TodoItemData = {
    ...todo,
    id: nanoid(), // Generate a unique ID with nanoid
    owner: context.user.id,
  };
  todos.push(newTodo);
  return newTodo;
}

/**
 * Retrieves a todo item by ID, ensuring it belongs to the current user.
 * @param {string} id - The ID of the todo item.
 * @param {ApiContext} context - The API context containing the user information.
 * @returns {TodoItemData} The retrieved todo item.
 * @throws {NotFoundError} If the todo item is not found or doesn't belong to the user.
 */
export async function todoStoreGet(id: string, context: ApiContext): Promise<TodoItemData> {
  const todo = todos.find((todo) => todo.id === id && todo.owner === context.user.id);
  if (!todo) {
    throw new NotFoundError();
  }
  return todo;
}

/**
 * Lists all todo items for the user, optionally filtered by a query-by-example object.
 * @param {ApiContext} context - The API context containing the user information.
 * @param {Partial<Omit<TodoItemData, 'owner'>>} [query] - Optional query to filter todos by example.
 * @returns {TodoItemData[]} An array of todo items matching the query.
 */
export async function todoStoreList(
  context: ApiContext,
  query?: Partial<Omit<TodoItemData, "owner">>,
): Promise<TodoItemData[]> {
  return todos.filter((todo) => {
    // Check ownership first
    if (todo.owner !== context.user.id) return false;

    // If no query is provided, return all todos for the user
    if (!query) return true;

    // Match each field in the query object
    return Object.entries(query).every(([key, value]) => todo[key as keyof TodoItemData] === value);
  });
}

/**
 * Updates a todo item by ID for the specified user.
 * @param {string} id - The ID of the todo item.
 * @param {Partial<Omit<TodoItemData, 'id' | 'owner'>>} updatedFields - Fields to update in the todo item.
 * @param {ApiContext} context - The API context containing the user information.
 * @returns {TodoItemData} The updated todo item.
 * @throws {NotFoundError} If the todo item is not found or doesn't belong to the user.
 */
export async function todoStoreUpdate(
  id: string,
  updatedFields: Partial<Omit<TodoItemData, "id" | "owner">>,
  context: ApiContext,
): Promise<TodoItemData> {
  const todoIndex = todos.findIndex((todo) => todo.id === id && todo.owner === context.user.id);
  if (todoIndex === -1) {
    throw new NotFoundError();
  }

  const existingTodo = todos[todoIndex];
  const updatedTodo = { ...existingTodo, ...updatedFields };
  todos[todoIndex] = updatedTodo;
  return updatedTodo;
}

/**
 * Deletes a todo item by ID for the specified user.
 * @param {string} id - The ID of the todo item.
 * @param {ApiContext} context - The API context containing the user information.
 * @returns {boolean} `true` if the item was deleted, otherwise `false`.
 * @throws {NotFoundError} If the todo item is not found or doesn't belong to the user.
 */
export async function todoStoreDelete(id: string, context: ApiContext): Promise<boolean> {
  const todoIndex = todos.findIndex((todo) => todo.id === id && todo.owner === context.user.id);
  if (todoIndex === -1) {
    throw new NotFoundError();
  }

  // Remove the todo item
  todos.splice(todoIndex, 1);
  return true;
}
