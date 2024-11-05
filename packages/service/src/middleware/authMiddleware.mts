import { FastifyRequest, FastifyReply } from "fastify";
import { ForbiddenError, UnauthorizedError } from "../service/errors.mjs";
import { UserToken } from "../interfaces/userToken.mjs";
import { ApiRequest, ApiResponse } from "../interfaces/apiContext.mjs";

export async function authMiddleware(request: ApiRequest, response: ApiResponse): Promise<void> {
  const userRoles: string[] = [];
  try {
    if (!request.apiContext) {
      throw new Error("API Context not initialized");
    }

    const token: UserToken = await request.jwtVerify();
    userRoles.push(...(token?.roles ?? []));

    if (!token?.id || !token.username || !token.roles) {
      throw new UnauthorizedError("Token missing required fields");
    }

    request.apiContext.user = token;
  } catch (error) {
    response.log.error(error, "JWT Verify Error");
    throw new UnauthorizedError("Invalid token", { cause: error });
  }

  const schema = request.routeOptions.schema as unknown as { "x-roles"?: string[] };
  const roles: string[] | undefined = schema?.["x-roles"];
  const missing = roles?.filter((role) => !userRoles.includes(role));

  if (missing?.length) {
    throw new ForbiddenError("Insufficient permissions", { data: { missing } });
  }

  if (roles) {
    response.log.debug({ userId: request.apiContext.user.id, roles }, "User has required roles");
  }
}
