import { describe, it, expect } from "vitest";
import { todoStoreCreate, todoStoreGet, todoStoreList, todoStoreUpdate, todoStoreDelete } from "./todoStore.mjs";
import { NotFoundError } from "../service/errors.mjs";
import { ApiContext } from "../interfaces/apiContext.mjs";

describe("Todo Store", () => {
  const context = { user: { id: "user123" } } as ApiContext;

  it("should create a new todo item", async () => {
    // Arrange
    const todoData = { title: "Learn TypeScript", description: "Complete the TypeScript tutorial", completed: false };

    // Act
    const newTodo = await todoStoreCreate(todoData, context);

    // Assert
    expect(newTodo).toHaveProperty("id");
    expect(newTodo.title).toBe(todoData.title);
    expect(newTodo.description).toBe(todoData.description);
    expect(newTodo.completed).toBe(todoData.completed);
    expect(newTodo.owner).toBe(context.user.id);

    const todos = await todoStoreList(context);
    expect(todos).toContainEqual(newTodo);
  });

  it("should list todos for the user", async () => {
    // Arrange
    const todoData = { title: "Learn TypeScript", description: "Complete the TypeScript tutorial", completed: false };
    await todoStoreCreate(todoData, context);

    // Act
    const todos = await todoStoreList(context);

    // Assert
    expect(todos.length).toBeGreaterThan(0);
    expect(todos.every((todo) => todo.owner === context.user.id)).toBe(true);
  });

  it("should list todos matching a query-by-example object", async () => {
    // Arrange
    await todoStoreCreate({ title: "Task 1", description: "Description 1", completed: false }, context);
    await todoStoreCreate({ title: "Task 2", description: "Description 2", completed: true }, context);
    await todoStoreCreate({ title: "Task 3", description: "Description 3", completed: true }, context);

    // Act
    const completedTodos = await todoStoreList(context, { completed: true });

    // Assert
    expect(completedTodos.length).toBe(2);
    expect(completedTodos.every((todo) => todo.completed === true)).toBe(true);
  });

  it("should get a todo item by ID", async () => {
    // Arrange
    const todoData = { title: "Learn TypeScript", description: "Complete the TypeScript tutorial", completed: false };
    const newTodo = await todoStoreCreate(todoData, context);

    // Act
    const fetchedTodo = await todoStoreGet(newTodo.id, context);

    // Assert
    expect(fetchedTodo).toBeDefined();
    expect(fetchedTodo.title).toBe(todoData.title);
    expect(fetchedTodo.description).toBe(todoData.description);
    expect(fetchedTodo.completed).toBe(todoData.completed);
  });

  it("should update a todo item", async () => {
    // Arrange
    const todoData = { title: "Learn TypeScript", description: "Complete the TypeScript tutorial", completed: false };
    const newTodo = await todoStoreCreate(todoData, context);

    // Act
    const updatedTodo = await todoStoreUpdate(newTodo.id, { completed: true }, context);

    // Assert
    expect(updatedTodo.completed).toBe(true);

    const fetchedTodo = await todoStoreGet(updatedTodo.id, context);
    expect(fetchedTodo.completed).toBe(true);
  });

  it("should delete a todo item", async () => {
    // Arrange
    const todoData = { title: "Learn TypeScript", description: "Complete the TypeScript tutorial", completed: false };
    const newTodo = await todoStoreCreate(todoData, context);

    // Act
    const isDeleted = await todoStoreDelete(newTodo.id, context);

    // Assert
    expect(isDeleted).toBe(true);

    const updatedTodos = await todoStoreList(context);
    expect(updatedTodos.some((todo) => todo.id === newTodo.id)).toBe(false);
  });

  it("should throw NotFoundError when accessing a non-existing todo", async () => {
    // Act & Assert
    await expect(() => todoStoreGet("non-existing-id", context)).rejects.toThrow(NotFoundError);
  });
});
