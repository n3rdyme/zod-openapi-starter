import { z } from "zod";

export const CreateTodoItemSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().optional(),
  })
  .openapi("CreateTodoItem");
