import { login, createTodo, deleteTodo, getTodos, updateTodo } from "./index.mjs";

async function main() {
  // Create a client instance
  const client = {
    login,
    createTodo,
    updateTodo,
    getTodos,
    deleteTodo,
  };

  const options: RequestInit & { baseUrl?: string } = { baseUrl: "http://localhost:3000" };

  // Call the login method to get a token
  const {
    data: { token },
  } = await client.login({ username: "admin", password: "password" }, options);
  console.log(token);
  options.headers = { Authorization: `Bearer ${token}` };

  // Call the methods
  const { data: item } = await client.createTodo({ title: "This is a test" }, options);

  console.log(item);

  const { data: updated } = await client.updateTodo(item.id, { title: "This is an updated test" }, options);
  console.log(updated);

  const { data: list } = await client.getTodos({ completed: false }, options);
  console.log(list);

  const { data } = await client.deleteTodo(item.id, options);
  console.log(data);

  console.log("success");

  process.exit(0);
}

main();
