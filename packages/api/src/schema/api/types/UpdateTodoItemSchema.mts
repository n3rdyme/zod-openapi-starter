import { z } from "zod";

export const UpdateTodoItemSchema = z
  .object({
    id: z
      .string()
      .regex(/^[\w-]{16,32}$/)
      .openapi({
        description: "The ID of the to-do item to update",
      }),
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    completed: z.boolean().optional(),
  })
  .openapi("UpdateTodoItem");
