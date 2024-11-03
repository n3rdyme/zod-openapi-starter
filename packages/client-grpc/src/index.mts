import { protoLoader } from "./protoLoader.mjs";
import * as grpc from "@grpc/grpc-js";

const MyService = protoLoader();
// Create a client instance
const client = new MyService("localhost:3001", grpc.credentials.createInsecure());

async function main() {
  const { token } = await client.login({ username: "admin", password: "password" });
  console.log("Token", token);
  process.exit(0);
}

main();
