/* <reference types="@fastify/jwt/types/jwt.d.ts" /> */
import type { ApiContext } from "../../interfaces/apiContext.mjs";
import { UserLoginInfo, LoginResponse } from "../../generated/index.mjs";
import { UnauthorizedError } from "../../service/errors.mjs";
import { UserToken } from "../../interfaces/userToken.mjs";

const users: UserToken[] = [
  { id: "1", username: "admin", timestamp: 0, roles: ["admin", "read", "write"] },
  { id: "2", username: "write", timestamp: 0, roles: ["read", "write"] },
  { id: "3", username: "read", timestamp: 0, roles: ["read"] },
];

export const login = async ({ username, password }: UserLoginInfo, context: ApiContext): Promise<LoginResponse> => {
  const user = users.find((user) => user.username === username);

  if (user && password === "password") {
    const tokenData: UserToken = Object.freeze({
      ...user,
      timestamp: Date.now(),
      roles: Object.freeze([...user.roles]),
    });

    const token = context.response.server.jwt.sign(tokenData, { expiresIn: "24h" });
    return { token };
  }

  throw new UnauthorizedError("Invalid username or password");
};
