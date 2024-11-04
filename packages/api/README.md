Based on the extracted structure, here’s a draft `README.md` for the `api` package:

---

# API Package

This package is responsible for defining the API schema, generating OpenAPI documentation, and configuring the necessary TypeScript and client SDK settings. It uses `zod-to-openapi` for schema definitions and `orval` for client SDK generation.

## Folder Structure

```plaintext
api/
├── package.json
├── tsconfig.json
├── orval.config.js
└── src/
    ├── index.mts
    ├── openapi.d.ts
    ├── openapi.json
    ├── schema/
    │   ├── index.mts
    │   ├── auth.mts
    │   ├── environment.mts
    │   └── api/
    │       ├── index.mts
    │       └── various schema files
```

## File Descriptions

### Root Files

- **`package.json`**: Defines the package’s dependencies, scripts, and metadata. Key dependencies include `zod`, `zod-to-openapi`, and `orval`. This file also specifies scripts for building the API, generating the OpenAPI spec, and creating a client SDK.
- **`tsconfig.json`**: TypeScript configuration file for setting up module resolution, compiler options, and output formats specific to the API package.
- **`orval.config.js`**: Configuration for `orval`, which generates a client SDK from the OpenAPI spec. This file defines where the OpenAPI spec is located and specifies client generation details, such as output paths and API configurations.

### `src/`

This directory contains the core TypeScript files for schema definitions, OpenAPI generation, and the main API export.

- **`index.mts`**: Main entry point for the API package. This file typically imports and exports all necessary modules for use by other parts of the application.
- **`openapi.d.ts`**: TypeScript declarations for the OpenAPI schema, ensuring types are properly integrated into the TypeScript environment.
- **`openapi.json`**: The generated OpenAPI specification in JSON format. This file is created by converting the Zod schemas and serves as the basis for API documentation and client SDK generation.

### `generator/`

- **`generate.mts`**: Main entry point to generate the openapi output.
- **`getErrorSchema.mts`**: Error definitions used by registerApi for 4xx, 5xx.
- other misc files for hooking/generating openapi with `zod-to-openapi`

### `schema/`

This folder houses all Zod schemas that define the API structure, including validation rules and data types. These schemas are transformed into OpenAPI specifications, ensuring consistent API documentation and client types.

- **`index.mts`**: Aggregates and exports all schemas within the `schema` directory, serving as the main entry point for the schema definitions.
- **`auth.mts`**: Contains authentication-related schemas, such as user login and registration. This file defines the structure and validation rules for authentication data.
- **`environment.mts`**: Defines environment-specific configurations and schema requirements, supporting configurations for different environments (e.g., development, production).

#### `schema/api/`

This subfolder includes additional schema files relevant to specific API endpoints or features. Each file within this directory defines the schema for a particular domain or resource.

- **`index.mts`**: Aggregates all schemas in `schema/api/`, making it easier to manage and import schema definitions in other parts of the application.
- **Various schema files**: Define the data structure, types, and validation rules for various resources or domains within the API.

## Getting Started

To set up and run the API package:

1. **Install dependencies**:

   ```bash
   yarn install
   ```

2. **Build the package**:

   ```bash
   yarn build
   ```

3. **Generate OpenAPI Specification**:

   ```bash
   yarn generate:openapi
   ```

4. **Generate Client SDK**:
   ```bash
   yarn generate:sdk
   ```

These steps will build the TypeScript files, generate the OpenAPI spec, and create a client SDK based on the OpenAPI spec.

## Additional Documentation

- **Zod**: [https://zod.dev/](https://zod.dev/)
- **zod-to-openapi**: [https://github.com/asteasolutions/zod-to-openapi](https://github.com/asteasolutions/zod-to-openapi)
- **Orval**: [https://orval.dev/](https://orval.dev/)
