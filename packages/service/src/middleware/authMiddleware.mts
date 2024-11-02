import { FastifyRequest, FastifyReply } from "fastify";
import { ForbiddenError, UnauthorizedError } from "../service/errors.mjs";
import { UserToken } from "../interfaces/userToken.mjs";

export async function authMiddleware(request: FastifyRequest, response: FastifyReply): Promise<void> {
  const userRoles: string[] = [];
  try {
    const token: UserToken = await request.jwtVerify();
    request.log.debug(token, "Token verified");
    userRoles.push(...(token.roles ?? []));

    if (!request.apiContext) {
      throw new Error("API Context not initialized");
    }
    request.apiContext.user = token;
  } catch (error) {
    response.log.error(error, "JWT Verify Error");
    throw new UnauthorizedError("Invalid token");
  }

  const schema = request.routeOptions.schema as unknown as { "x-roles"?: string[] };
  const roles: string[] | undefined = schema?.["x-roles"];
  const missing = roles?.filter((role) => !userRoles.includes(role));
  if (missing?.length) {
    throw new ForbiddenError("Insufficient permissions", { data: { missing } });
  }

  if (roles) {
    response.log.debug({ roles }, "User has required roles");
  }
}
