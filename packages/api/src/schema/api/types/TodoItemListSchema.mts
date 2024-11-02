import { z } from "zod";
import { TodoItemSchema } from "./TodoItemSchema.mjs";

export const TodoItemListSchema = z
  .object({
    items: z.array(TodoItemSchema),
  })
  .openapi("TodoItemList");
