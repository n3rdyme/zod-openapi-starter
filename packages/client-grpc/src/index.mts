import { protoLoader } from "./protoLoader.mjs";
import { type ChannelOptions, credentials } from "@grpc/grpc-js";

// Export all generated types
// export * from "./generated/example/todo/TodoListService.js";

// Make sure we only load the proto once
const getService = (() => {
  let service: ReturnType<typeof protoLoader>;
  return async () => {
    if (!service) {
      service = protoLoader();
    }
    return service;
  };
})();

export type { ChannelOptions };

/**
 * Create a client instance for the TodoListService
 * @param url The URL of the server in the format "host:port"
 * @param options {ChannelOptions} Optional channel options
 * @returns {TodoListService} A client instance
 */
export async function createClient(url: string, options?: ChannelOptions) {
  // Create a client instance
  const TodoListService = await getService();
  const client = new TodoListService(url, credentials.createInsecure(), options);
  return client;
}
