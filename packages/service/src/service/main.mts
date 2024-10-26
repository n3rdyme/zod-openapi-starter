import { fastify } from "./fastifyService.mjs";

export async function start() {
  // Start the server
  fastify.listen({ port: 3000 }, (err: unknown) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log("Server listening on http://localhost:3000");
    console.log("API docs available at http://localhost:3000/docs");
  });

  process.on("SIGINT", async () => {
    await stop();
    process.exit(0);
  });
}

export async function stop() {
  // Stop the server
  fastify.close();
}
