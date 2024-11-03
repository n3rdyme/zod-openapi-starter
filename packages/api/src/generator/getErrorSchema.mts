import { z } from "zod";

export const getErrorSchema = () => {
  const ErrorSchema = z
    .object({
      statusCode: z.number().int().openapi({ format: "int32" }),
      code: z.string().optional(),
      message: z.string().default("Unknown Error"),
      issues: z.array(z.string()).optional(),
      data: z
        .map(z.string(), z.string())
        .optional()
        .openapi("ErrorDetailsData", { type: "object", additionalProperties: { type: "string" } }),
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
