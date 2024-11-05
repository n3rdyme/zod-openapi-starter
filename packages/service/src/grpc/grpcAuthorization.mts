/* eslint-disable @typescript-eslint/no-explicit-any */
import { GrpcEventArgs } from "./grpcServerStub.mjs";
import { authMiddleware } from "../middleware/authMiddleware.mjs";
import { NotImplementedError } from "../service/errors.mjs";

export async function grpcAuthorization({ operation, context, schema }: GrpcEventArgs) {
  for (const authTypes of operation.security ?? []) {
    const defType = Object.keys(authTypes)[0];
    const securityScheme: any = defType && schema.components?.securitySchemes?.[defType];

    if (securityScheme.type === "http" && securityScheme.scheme === "bearer" && securityScheme.bearerFormat === "JWT") {
      await authMiddleware(context.request as any, context.response as any);
    } else {
      throw new NotImplementedError("Unsupported security scheme", { data: securityScheme });
    }
  }
}
