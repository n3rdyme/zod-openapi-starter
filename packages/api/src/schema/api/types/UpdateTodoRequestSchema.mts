import { z } from "zod";

export const UpdateTodoRequestSchema = z
  .object({
    id: z.string().uuid().openapi({
      description: "The ID of the to-do item to update",
    }),
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    completed: z.boolean().optional(),
  })
  .openapi("UpdateTodoRequest");
