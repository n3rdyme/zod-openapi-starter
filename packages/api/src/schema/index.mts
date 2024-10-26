import { z } from "zod";
import registry from "./registry.mjs";

const ErrorSchema = z
  .object({
    statusCode: z.number().int().openapi({ format: "int32" }),
    code: z.string().optional(),
    message: z.string().default("Unknown Error"),
    issues: z
      .array(z.union([z.string(), z.object({}).passthrough().openapi({ additionalProperties: true })]))
      .optional(),
    data: z.object({}).passthrough().openapi({ additionalProperties: true }).optional(),
  })
  .openapi("ErrorDetails");

const code4xx: number = "4XX" as unknown as number;
const code5xx: number = "5XX" as unknown as number;

const errorFormat = {
  [code5xx]: {
    description: "Internal Server Error",
    content: {
      "application/json": {
        schema: ErrorSchema,
      },
    },
  },
  [code4xx]: {
    description: "Invalid Request Error",
    content: {
      "application/json": {
        schema: ErrorSchema,
      },
    },
  },
};

const TodoItemSchema = z
  .object({
    id: z.string().uuid(),
    title: z.string().min(1),
    description: z.string().optional(),
    completed: z.boolean(),
  })
  .openapi("TodoItem");

const TodoItemListSchema = z
  .object({
    items: z.array(TodoItemSchema),
  })
  .openapi("TodoItemList");

const CreateTodoRequestSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().optional(),
  })
  .openapi("CreateTodoRequest");

const UpdateTodoRequestSchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    completed: z.boolean().optional(),
  })
  .openapi("UpdateTodoRequest");

// Register the POST /todos endpoint to create a to-do
registry.registerPath({
  method: "post",
  path: "/todos",
  operationId: "createTodo",
  description: "Create a new to-do item",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateTodoRequestSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "The created to-do item",
      content: {
        "application/json": {
          schema: TodoItemSchema,
        },
      },
    },
    ...errorFormat,
  },
});

// Register the GET /todos endpoint to retrieve the list of to-dos
registry.registerPath({
  method: "get",
  path: "/todos",
  operationId: "getTodos",
  description: "Retrieve a list of to-do items",
  responses: {
    200: {
      description: "A list of to-do items",
      content: {
        "application/json": {
          schema: TodoItemListSchema,
        },
      },
    },
    ...errorFormat,
  },
});

// Register the PUT /todos/{id} endpoint to update a to-do item by ID
registry.registerPath({
  method: "put",
  path: "/todos/{id}",
  operationId: "updateTodo",
  description: "Update an existing to-do item by ID",
  request: {
    params: z.object({
      id: z.string().uuid().openapi({
        description: "The ID of the to-do item to update",
      }),
    }),
    body: {
      content: {
        "application/json": {
          schema: UpdateTodoRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "The updated to-do item",
      content: {
        "application/json": {
          schema: TodoItemSchema,
        },
      },
    },
    ...errorFormat,
  },
});

// Register the DELETE /todos/{id} endpoint to delete a to-do item by ID
registry.registerPath({
  method: "delete",
  path: "/todos/{id}",
  operationId: "deleteTodo",
  description: "Delete a to-do item by ID",
  request: {
    params: z.object({
      id: z.string().uuid().openapi({
        description: "The ID of the to-do item to update",
      }),
    }),
  },
  responses: {
    204: {
      description: "To-do item deleted successfully",
    },
    ...errorFormat,
  },
});
