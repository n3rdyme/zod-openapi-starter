import { FastifyRequest, FastifyReply } from "fastify";

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  return;

  // // Implement JWT bearer token validation
  // const authHeader = request.headers.authorization;
  // if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //   reply.status(401).send({ message: "Unauthorized" });
  //   return;
  // }
  // const token = authHeader.split(" ")[1];
  // // Verify the JWT token logic here
  // // If invalid token, reply with 401 Unauthorized
  // if (token !== "valid-token") {
  //   reply.status(401).send({ message: "Unauthorized" });
  //   return;
  // }
}
