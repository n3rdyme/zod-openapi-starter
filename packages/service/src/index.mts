// Create Fastify instance
import { fastify } from "./service/fastifyService.mjs";

// Start the server
fastify.listen({ port: 3000 }, (err: unknown) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log("Server listening on http://localhost:3000");
  console.log("API docs available at http://localhost:3000/docs");
});
