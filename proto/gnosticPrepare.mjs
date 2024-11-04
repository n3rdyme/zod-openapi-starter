import fs from "fs-extra";
import path from "path";

const pascalCase = (str) => {
  return str.replace(/(^\w|[-_]\w)/g, (match) => match.replace(/[-_]/, "").toUpperCase());
};

const rewriteOpenAPISpec = (spec) => {
  const usedSchemas = new Set();
  const newPaths = {};

  // Process each path and operation in the OpenAPI spec
  for (const [originalPath, pathItem] of Object.entries(spec.paths)) {
    if (!pathItem) continue;

    for (const [method, operation] of Object.entries(pathItem)) {
      if (!operation || typeof operation !== "object" || !operation.operationId) continue;

      const operationId = operation.operationId;
      const pascalCaseId = pascalCase(operationId);
      const grpcPath = `/$grpc/${operationId}`;
      const requestTypeName = `${pascalCaseId}Request`;

      // Set the x-google-api-http syntax with the original method and path
      const googleApiHttpOption = {
        // [`x-google-api-http`]: `option (google.api.http) = { ${method.toLowerCase()}:"${originalPath}" };`,
        // "x-original-method": method.toUpperCase(),
        "x-original-path": originalPath,
      };

      // Create new path with the original HTTP method
      newPaths[grpcPath] = newPaths[grpcPath] || {};
      newPaths[grpcPath][method] = {
        ...operation,
        ...googleApiHttpOption,
        operationId,
        parameters: [],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: `#/components/schemas/${requestTypeName}` },
            },
          },
        },
        responses: retainSuccessfulResponses(operation.responses),
      };

      // Start with the body schema as the base for the combined request schema
      let combinedSchema = {
        type: "object",
        properties: {},
        required: [],
      };

      if (operation.requestBody && "content" in operation.requestBody) {
        const bodyContent = operation.requestBody.content["application/json"];
        if (bodyContent && bodyContent.schema) {
          const bodySchema = dereferenceSchema(bodyContent.schema, spec);
          if (bodySchema.type !== "object" || !bodySchema.properties) {
            throw new Error(`The body schema for operation ${operationId} must be an object with properties.`);
          }
          // Use bodySchema as the base for combinedSchema
          combinedSchema = JSON.parse(JSON.stringify(bodySchema)); // Deep clone to avoid mutations
        }
      }

      // Add path and query parameters to the combined schema
      if (operation.parameters) {
        for (const param of operation.parameters) {
          if (param.in === "path" || param.in === "query") {
            const schemaRef = param.schema?.$ref || param.schema;
            if (schemaRef) {
              combinedSchema.properties[param.name] = dereferenceSchema(schemaRef, spec);
              if (param.in === "path") {
                combinedSchema.required = combinedSchema.required || [];
                combinedSchema.required.push(param.name);
              }
            }
          }
        }
      }

      // Ensure uniqueness of required fields
      if (combinedSchema.required) {
        combinedSchema.required = Array.from(new Set(combinedSchema.required));
      }

      // Add the new combined request schema to components/schemas
      spec.components = spec.components || { schemas: {} };
      spec.components.schemas[requestTypeName] = combinedSchema;
    }
  }

  // Prepare newComponents, preserving all other children in components
  const newComponents = { ...spec.components, schemas: {} };

  // Walk through newPaths to capture all $ref dependencies
  collectSchemaRefs(newPaths, usedSchemas);

  // Walk through the entire newComponents to capture any additional $ref dependencies
  collectSchemaRefs(newComponents, usedSchemas);

  // Prune unused schemas in components/schemas
  if (spec.components && spec.components.schemas) {
    for (const [schemaName, schema] of Object.entries(spec.components.schemas)) {
      if (usedSchemas.has(`#/components/schemas/${schemaName}`)) {
        newComponents.schemas[schemaName] = schema;
      }
    }
  }

  return {
    ...spec,
    paths: newPaths,
    components: newComponents,
  };
};

// Helper to retain only successful (2XX) responses
const retainSuccessfulResponses = (responses) => {
  const successfulResponses = {};
  for (const [status, response] of Object.entries(responses || {})) {
    if (status.startsWith("2")) {
      successfulResponses[status] = response;
    }
  }
  return successfulResponses;
};

// Helper to dereference schema, inlining if necessary
const dereferenceSchema = (schema, spec) => {
  if (schema.$ref) {
    const schemaName = schema.$ref.replace("#/components/schemas/", "");
    return spec.components?.schemas?.[schemaName] || {};
  }
  return schema;
};

// Recursive helper to collect all $ref dependencies in an object
const collectSchemaRefs = (obj, usedSchemas) => {
  if (typeof obj !== "object" || obj === null) return;

  if (Array.isArray(obj)) {
    obj.forEach((item) => collectSchemaRefs(item, usedSchemas));
  } else {
    for (const [key, value] of Object.entries(obj)) {
      if (key === "$ref" && typeof value === "string") {
        usedSchemas.add(value);
      } else {
        collectSchemaRefs(value, usedSchemas);
      }
    }
  }
};

// Main function to load, process, and save the rewritten OpenAPI spec
const main = async () => {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3] || inputPath;

  if (!inputPath) {
    console.error("Please specify the path to the input OpenAPI JSON file.");
    process.exit(1);
  }

  try {
    const openapiSpec = await fs.readJSON(inputPath);
    const modifiedSpec = rewriteOpenAPISpec(openapiSpec);
    await fs.writeJSON(outputPath, modifiedSpec, { spaces: 2 });
  } catch (error) {
    console.error("Error processing OpenAPI spec:", error);
    process.exit(1);
  }
};

main();
