import { protoLoader } from "./protoLoader.mjs";
import * as grpc from "@grpc/grpc-js";

const MyService = protoLoader();
// Create a client instance
const client = new MyService("localhost:3001", grpc.credentials.createInsecure());

async function main() {
  const login = await client.login({ username: "admin", password: "password" });
  console.log(login);

  let item = await client.createTodo({ title: "This is a test" });
  console.log(item);

  item = await client.updateTodo({ id: item.id, title: "This is an updated test" });
  console.log(item);

  const list = await client.getTodos({ completed: false });
  console.log(list);

  await client.deleteTodo({ id: item.id });

  process.exit(0);
}

main();
