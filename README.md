# zod-openapi-starter

A simple declarative-first Node.js starter project utilizing TypeScript, Fastify, and OpenAPI for scalable and reliable API development.

## Getting Started

To set up and run the service:

1. **Install dependencies**:

   ```bash
   yarn install
   ```

2. **Build, lint, and test the package**:

   ```bash
   yarn all
   ```

3. **Run the service**:
   ```bash
   yarn watch
   ```

---

## API Definition with `zod-to-openapi`

The API schema definitions for this project are located in `packages/api/src/schema/**`. We use `@asteasolutions/zod-to-openapi` to define and validate APIs. This approach leverages Zod schemas to not only validate but also generate OpenAPI specifications directly from the schema definitions, streamlining the process and ensuring consistency between validation logic and API documentation. A lightweight wrapper has been added to the `registry` object, `registerApi` which makes it clean and simple to register an api.

### Example

```typescript
// Register endpoints by calling registerApi
registry.registerApi({
  tags: ["todos"],
  name: "createTodo",
  description: "Create a new to-do item",
  method: "post",
  path: "/todos",
  request: CreateTodoRequestSchema,
  response: {
    statusCode: 201,
    schema: TodoItemSchema,
  },
  roles: ["write"],
});
```

### Creating API Schemas

1. Define your API models and request/response objects using Zod in `packages/api/src/schema`.
2. Use `@asteasolutions/zod-to-openapi` to register the endpoint.
3. The generated OpenAPI spec can then be used for routing, validation, and client SDK generation.

---

## Project Structure

This repository follows a monorepo setup managed by Yarn Workspaces and Turbo Repo. Below is an overview of the core folders:

### `docker`

- Contains Docker configurations, specifically for Jaeger, an open-source tool for distributed tracing.

### `packages`

- All project modules and packages reside here:
  - `api`: Defines the OpenAPI schema and handles API-related logic, using Fastify as the HTTP server.
  - `client-sdk`: A generated SDK for clients based on the OpenAPI spec, created with tools like `orval`.
  - `service`: Contains business logic and integrates with other packages.

---

## Root Scripts

The repository provides several root-level scripts to manage and automate common tasks:

### Script Details

- **`all`**: Runs build, format, lint, and test tasks sequentially.
- **`preinstall`**: Ensures Yarn is used instead of npm to prevent potential dependency issues.
- **`build`**: Builds all packages using Turbo Repo.
- **`lint`**: Runs linting on all packages.
- **`format`**: Formats code using Prettier.
- **`test`**: Runs tests across all packages.
- **`watch`**: Watches for changes in the `service` package.
- **`trace`**: Starts Jaeger and runs tracing on the `service` package.
- **`jaeger:start`** and **`jaeger:stop`**: Controls the Jaeger Docker instance for distributed tracing.
- **`for-each`**: Executes tasks for each workspace sequentially, useful for complex workflows that require running one task at a time.

---

## Tooling

- **Node.js**: Version 22, enabling recent features and optimizations.
- **Yarn**: Used for package management and workspace orchestration.
- **Turbo Repo**: Speeds up builds and test processes for the monorepo.
- **TypeScript**: For static typing and strict validation.
- **Prettier**: Code formatting to enforce a consistent style.
- **ESLint**: Linting for code quality assurance.

This setup offers a highly structured environment for consistent, scalable, and maintainable code. By using Turbo Repo for task orchestration, `zod-to-openapi` for schema and API definition, and Fastify with `fastify-openapi-glue`, this project is designed to be efficient and developer-friendly.

---

## Technologies Used

### Core Dependencies

- **[Fastify](https://www.fastify.io/)**: A fast and low overhead web framework for Node.js.

  - **[@fastify/cors](https://github.com/fastify/fastify-cors)**: Cross-Origin Resource Sharing (CORS) for Fastify.
  - **[@fastify/helmet](https://github.com/fastify/fastify-helmet)**: Helmet integration for Fastify to add security headers.
  - **[@fastify/jwt](https://github.com/fastify/fastify-jwt)**: JSON Web Token (JWT) authentication for Fastify.
  - **[@fastify/rate-limit](https://github.com/fastify/fastify-rate-limit)**: Rate limiting for Fastify.
  - **[@fastify/response-validation](https://github.com/fastify/fastify-response-validation)**: Response validation for Fastify.
  - **[@fastify/swagger](https://github.com/fastify/fastify-swagger)**: Swagger documentation for Fastify.
  - **[@fastify/swagger-ui](https://github.com/fastify/fastify-swagger)**: Swagger UI for interactive API documentation.

- **[ajv](https://ajv.js.org/)**: JSON Schema Validator.
  - **[ajv-errors](https://github.com/ajv-validator/ajv-errors)**: Custom error messages for Ajv.
- **[Pino](https://getpino.io/)**: High-performance logging library for Node.js.
  - **[pino-pretty](https://github.com/pinojs/pino-pretty)**: Formatter for pretty-printing Pino logs.
- **[Zod](https://zod.dev/)**: TypeScript-first schema declaration and validation library.

### OpenAPI and Code Generation

- **[@asteasolutions/zod-to-openapi](https://github.com/asteasolutions/zod-to-openapi)**: Converts Zod schemas to OpenAPI definitions.
- **[Orval](https://orval.dev/)**: Generates client SDKs from OpenAPI specs.
- **[json-schema-faker](https://github.com/json-schema-faker/json-schema-faker)**: Generates fake data based on JSON Schema definitions.

### Observability and Tracing

- **[OpenTelemetry](https://opentelemetry.io/)**: Provides distributed tracing and metrics collection.
  - **[@opentelemetry/instrumentation-fastify](https://www.npmjs.com/package/@opentelemetry/instrumentation-fastify)**: Fastify instrumentation for OpenTelemetry.
  - **[@opentelemetry/sdk-trace-node](https://www.npmjs.com/package/@opentelemetry/sdk-trace-node)**: Node.js trace SDK for OpenTelemetry.
  - **[@opentelemetry/exporter-metrics-otlp-proto](https://www.npmjs.com/package/@opentelemetry/exporter-metrics-otlp-proto)**: OpenTelemetry Protocol (OTLP) exporter for metrics.

### Development and Testing

- **[TypeScript](https://www.typescriptlang.org/)**: Strongly typed programming language that builds on JavaScript.
- **[ESLint](https://eslint.org/)**: Pluggable JavaScript linter.
  - **[@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint)**: ESLint plugin for TypeScript support.
  - **[eslint-plugin-import](https://github.com/import-js/eslint-plugin-import)**: Linter for ES6+ import/export syntax.
  - **[eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier)**: Integrates Prettier formatting rules into ESLint.
- **[Prettier](https://prettier.io/)**: Code formatter to enforce consistent style.
- **[Vitest](https://vitest.dev/)**: A fast unit test framework powered by Vite.

### Docker Compose

These are used for open-telemetry reporting in development/local environments.

- **[Jaeger](https://www.jaegertracing.io/)**: Distributed tracing system for microservices.
- **[Zipkin](https://zipkin.io/)**: Distributed tracing system compatible with Jaeger.
- **[Prometheus](https://prometheus.io/)**: Monitoring system and time-series database.
