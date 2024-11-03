import { environment } from "../environment.mjs";
import { fastify } from "./fastifyService.mjs";

export async function startFastify() {
  // Start the server
  fastify.listen({ port: environment.port, host: environment.host }, (err: unknown) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log("Server listening on http://localhost:3000");
    console.log("API docs available at http://localhost:3000/docs");
  });

  process.on("SIGINT", async () => {
    await stopFastify();
    process.exit(0);
  });
}

export async function stopFastify() {
  // Stop the server
  fastify.close();
}
