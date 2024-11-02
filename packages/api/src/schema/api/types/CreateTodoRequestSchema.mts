import { z } from "zod";

export const CreateTodoRequestSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().optional(),
  })
  .openapi("CreateTodoRequest");
