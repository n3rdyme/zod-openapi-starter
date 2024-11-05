/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRequire } from "module";
import type {
  createGraphQLSchema as TypeCreateGraphQLSchema,
  Options as OpenApiToGraphOptions,
} from "openapi-to-graphql";
import { FastifyInstance } from "fastify";
import mercurius, { type MercuriusOptions } from "mercurius";
import openApiSpec from "@local/api";

// OpenAPI-to-GraphQL requires CommonJS-style imports
const require = createRequire(import.meta.url);
const openApiToGraphql = require("openapi-to-graphql");
const createGraphQLSchema = openApiToGraphql.createGraphQLSchema as typeof TypeCreateGraphQLSchema;

const pseudoUri = "fastify://localhost";

/**
 * Often this will be a separate service, but for the sake of simplicity, we're
 * combining the Fastify service and the GraphQL service into one.
 *
 * We're using the `openapi-to-graphql` package to convert the OpenAPI spec into
 * a GraphQL schema. This allows us to use the same spec for both REST and GraphQL.
 *
 * The `openapi-to-graphql` package requires a `fetch` function to resolve the
 * GraphQL requests. We're using Fastify's own `inject` method to self-resolve.
 *
 * psuedoUri is used to identify the local GraphQL requests.
 */
export function fastifyGraphql(app: FastifyInstance) {
  // Disable helmet and response validation for the GraphQL routes
  app.addHook("onRoute", (routeOptions) => {
    if (routeOptions.url?.startsWith("/graphiql")) {
      routeOptions.helmet = false;
      routeOptions.responseValidation = false;
    } else if (routeOptions.url?.startsWith("/graphql")) {
      routeOptions.responseValidation = false;
    }
  });

  // Options for the openapi-to-graphql package
  const openApiToGraphOptions: OpenApiToGraphOptions<any, any, any> = {
    fillEmptyResponses: true,
    baseUrl: pseudoUri,
    viewer: false,
    fetch: async (url, options) => {
      // Use Fastify's own fetch mechanism to self-resolve the GraphQL requests
      const response = await app.inject({
        method: options?.method || "GET",
        url: `${url}`.substring(pseudoUri.length),
        payload: options?.body,
        headers: options?.headers,
      } as any);
      return {
        headers: new Map(Object.entries(response.headers)),
        json: async () => JSON.parse(response.body),
        text: async () => response.body,
        status: response.statusCode,
        statusText: response.statusMessage,
      } as any;
    },
  };

  // Create the GraphQL schema from the OpenAPI spec
  createGraphQLSchema(openApiSpec as any, openApiToGraphOptions)
    // Register the GraphQL service once we have the schema
    .then(({ schema, report }) => {
      if (report?.warnings?.length) {
        app.log.warn(report, "OpenAPI-to-GraphQL Warnings");
      }

      // Report the GraphQL and GraphiQL addresses once the service is ready
      const reportAddress = () => {
        try {
          app.log.debug(`GraphQL listening at ${app.listeningOrigin}/graphql`);
          app.log.debug(`GraphiQL listening at ${app.listeningOrigin}/graphiql`);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (ex) {
          setTimeout(reportAddress, 10);
        }
      };

      app.ready(reportAddress);

      // Register the Mercurius plugin with the GraphQL schema
      const options: MercuriusOptions = {
        schema,
        graphiql: true,
        // not working for graphiql:
        // additionalRouteOptions: { helmet: false },
      };

      app.register(mercurius, options);
    })
    .catch((error: any) => {
      app.log.error(error, "Error creating GraphQL schema");
    });
}
