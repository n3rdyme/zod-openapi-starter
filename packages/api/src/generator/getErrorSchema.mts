import { z } from "zod";

export const getErrorSchema = () => {
  const ErrorSchema = z
    .object({
      statusCode: z.number().int().openapi({ format: "int32" }),
      code: z.string().optional(),
      message: z.string().default("Unknown Error"),
      issues: z.array(z.any()).optional(),
      data: z.any().optional(),
    })
    .openapi("ErrorDetails");

  const code4xx: number = "4XX" as unknown as number;
  const code5xx: number = "5XX" as unknown as number;

  return {
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
};
