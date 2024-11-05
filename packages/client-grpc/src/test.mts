import { createClient } from "./index.mjs";

async function main() {
  // Create a client instance
  const client = await createClient("localhost:3001");

  // Call the login method to get a token
  const login = await client.login({ username: "admin", password: "password" });
  console.log(login);

  // Add the token to the metadata
  client.grpcMetadataIn.add("authorization", `Bearer ${login.token}`);

  // Call the methods
  let item = await client.createTodo({ title: "This is a test" });
  console.log(item);

  item = await client.updateTodo({ id: item.id, title: "This is an updated test" });
  console.log(item);

  const list = await client.getTodos({ completed: false });
  console.log(list);

  await client.deleteTodo({ id: item.id });

  // Close the connection
  await client.close();
  console.log("success");

  process.exit(0);
}

main();
