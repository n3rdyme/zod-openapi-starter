import { z } from "zod";

export const TodoItemSchema = z
  .object({
    id: z.string().uuid(),
    title: z.string().min(1),
    description: z.string().optional(),
    completed: z.boolean(),
  })
  .openapi("TodoItem");
