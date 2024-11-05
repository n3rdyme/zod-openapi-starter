# Service Package

The `service` package is responsible for implementing core service functionality, handling API requests, managing data storage, environment configuration, and integrating distributed tracing. This service is built with TypeScript, uses Fastify as its HTTP server, and leverages OpenTelemetry for observability.

## Folder Structure

The `service` package is organized into the following directories:

```plaintext
service/
├── package.json
├── esbuild.config.mjs
├── tsconfig.json
└── src/
    ├── index.mts
    ├── otlp-trace.mjs
    ├── environment.mts
    ├── generated/
    │   └── generated types and files
    ├── grpc/
    │   └── core grpc service logic
    ├── service/
    │   └── core Fastify setup and service logic
    ├── handlers/
    │   ├── todos/
    │   └── auth/
    ├── interfaces/
    ├── middleware/
    └── repositories/
```

## File Descriptions

### Root Files

- **`package.json`**: Specifies package dependencies, scripts, and metadata. Includes Fastify, tracing, and other necessary dependencies for running and testing the service.
- **`esbuild.config.mjs`**: Configuration for `esbuild`, used to bundle the TypeScript code efficiently for deployment.
- **`tsconfig.json`**: TypeScript configuration that sets up module resolution, compiler options, and output for the project.

---

## `src/` Directory

The `src` folder contains the core implementation of the service logic, divided into specific subdirectories for modularity and maintainability.

### Root Files in `src`

- **`index.mts`**: Main entry point that initializes the service, dependencies, and core components.
- **`otlp-trace.mjs`**: Configures OpenTelemetry (OTLP) for distributed tracing, essential for monitoring and observability.
- **`environment.mts`**: Manages environment-specific configurations and variables, allowing for different settings in various deployment environments.

---

### Subdirectories in `src`

#### `generated/`

Contains automatically generated files based on the OpenAPI specification. These files provide TypeScript types for API requests and responses, ensuring data structures align with the API schema.

#### `service/`

This directory includes core logic related to setting up and managing the Fastify server:

- **`fastifyHandlers.mts`**: Connects routes to handlers, managing incoming requests and responses.
- **`fastifyStub.mts`**: Contains placeholder or testing stubs for parts of the Fastify service.
- **`fastifyTelemetry.mts`**: Integrates telemetry data with Fastify, enabling detailed monitoring.
- **`main.mts`** and **`main.test.mts`**: The primary service logic and its tests, initializing core components and dependencies.
- **`fastifyService.mts`**: Configures the Fastify server, adding middleware and plugins.
- **`errors.mts`**: Centralizes error definitions for consistent error handling across the service.

#### `grpc/`

This directory includes core logic related to setting up and managing the gRPC server:

- **`grpcServerStub.mts`**: Defines the core gRPC server, connecting services defined in `.proto` files to their implementations.
- **`grpcAuthorization.mts`**: Middleware for gRPC authorization, handling token verification and enforcing access controls.
- **`grpcResponse.mts`**: Utilities for consistent response handling in gRPC calls.
- **`main.mts`**: Initializes and starts the gRPC server.
- **`protoLoader.mts`**: Loads `.proto` files using `@grpc/proto-loader` for compatibility with `@grpc/grpc-js`.

#### `handlers/`

Defines specific request handlers for different parts of the service, organized by resource:

- **`index.mts`**: (generated file) Exposes a getHandlers function to build a server stub with by operationId.
- **`todos/`**: Handles CRUD operations for todo items.
  - **`updateTodo.mts`**: Updates a todo item.
  - **`createTodo.mts`**: Creates a new todo item.
  - **`deleteTodo.mts`**: Deletes a specified todo item.
  - **`getTodos.mts`**: Retrieves a list of todo items.
- **`auth/`**: Handles authentication operations.
  - **`login.mts`**: Manages the login process, validating credentials and generating tokens.

#### `interfaces/`

Contains TypeScript interfaces that define the structure of common objects within the service:

- **`userToken.mts`**: Interface for user tokens, used in authentication.
- **`apiContext.mts`**: Shared API context, possibly containing request metadata and authentication details.

#### `middleware/`

Reusable middleware functions for handling cross-cutting concerns such as logging, validation, and error handling:

- **`responseValidation.mts`**: Validates responses against schemas.
- **`logger.mts`**: Configures logging to capture request and response data.
- **`ajv-validation.mts`**: Uses `ajv` for advanced JSON schema validation of incoming requests.
- **`errorHandler.mts`**: Centralized error-handling middleware for consistent error transformation and logging.
- **`authMiddleware.mts`**: Authenticates requests by validating tokens and enforcing access control on protected routes.

#### `repositories/`

Organizes data access and storage logic, especially for CRUD operations on the `todos` resource:

- **`todoStore.mts`**: Manages data storage and retrieval for todo items.
- **`todoStore.test.mts`**: Tests for `todoStore.mts`, ensuring data operations function correctly.

---

## Getting Started

To set up and run the service:

1. **Install dependencies**:

   ```bash
   yarn install
   ```

2. **Build the package**:

   ```bash
   yarn build
   ```

3. **Run the service**:
   ```bash
   yarn start
   ```

This will install dependencies, compile the TypeScript files, and start the service.

---

## Additional Documentation

- **Fastify**: https://www.fastify.io/
- **OpenTelemetry**: https://opentelemetry.io/
- **@grpc/grpc-js**: https://www.npmjs.com/package/@grpc/grpc-js
- **@grpc/proto-loader**: https://www.npmjs.com/package/@grpc/proto-loader
