/* <reference types="@fastify/jwt/types/jwt.d.ts" /> */
import type { ApiContext } from "../../interfaces/apiContext.mjs";
import { LoginRequest, LoginResponse } from "../../generated/index.mjs";
import { UnauthorizedError } from "../../service/errors.mjs";
import { UserToken } from "../../interfaces/userToken.mjs";

export const login = async ({ username, password }: LoginRequest, context: ApiContext): Promise<LoginResponse> => {
  if (username === "admin" && password === "password") {
    const tokenData: UserToken = { username, timestamp: Date.now(), roles: ["admin", "read", "write"] };

    const token = context.response.server.jwt.sign(tokenData, { expiresIn: "24h" });
    return { token };
  }

  throw new UnauthorizedError("Invalid username or password");
};
