import { z } from "zod";
import type { ApiEndpoint } from "../../generator/index.mjs";
import { CreateTodoItemSchema } from "./types/CreateTodoItemSchema.mjs";
import { TodoItemSchema } from "./types/TodoItemSchema.mjs";
import { TodoItemListSchema } from "./types/TodoItemListSchema.mjs";
import { UpdateTodoItemSchema } from "./types/UpdateTodoItemSchema.mjs";

/**
 * The to-do API endpoints are collected here to be registered with the OpenAPI registry.
 *
 * @summary Feel free to organize your API endpoints and types in any way you like.
 */
export const todoApi: ApiEndpoint[] = [
  {
    // Register the POST /todos endpoint to create a to-do
    tags: ["todos"],
    name: "createTodo",
    description: "Create a new to-do item",
    method: "post",
    path: "/todos",
    request: CreateTodoItemSchema,
    response: {
      statusCode: 201,
      schema: TodoItemSchema,
    },
    roles: ["write"],
  },

  // Register the GET /todos endpoint to retrieve the list of to-dos
  {
    tags: ["todos"],
    name: "getTodos",
    description: "Retrieve a list of to-do items",
    method: "get",
    path: "/todos",
    query: z.object({ completed: z.boolean().optional() }),
    response: TodoItemListSchema,
    roles: ["read"],
  },

  // Register the PUT /todos/{id} endpoint to update a to-do item by ID
  {
    tags: ["todos"],
    name: "updateTodo",
    description: "Update an existing to-do item by ID",
    method: "put",
    path: "/todos/{id}",
    request: UpdateTodoItemSchema,
    response: TodoItemSchema,
    roles: ["write"],
  },

  // Register the DELETE /todos/{id} endpoint to delete a to-do item by ID
  {
    tags: ["todos"],
    name: "deleteTodo",
    description: "Delete a to-do item by ID",
    method: "delete",
    path: "/todos/{id}",
    request: z.object({
      id: z
        .string()
        .regex(/^[\w-]{16,32}$/)
        .openapi({
          description: "The ID of the to-do item to remove",
        }),
    }),
    response: 204,
    roles: ["admin"],
  },
];
