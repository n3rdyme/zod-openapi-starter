import Fastify from 'fastify';
import { fastifySwagger } from '@fastify/swagger';
import { fastifyOpenapiGlue } from 'fastify-openapi-glue';
import openApiDocument from './openapi.json';
import { service } from './service';
import { setCustomAjvOptions } from './validator';
import { authMiddleware } from './authMiddleware';
import { customLogger } from './logger';
import { errorHandler } from './errorHandler';

// Create Fastify instance
const app = Fastify({ logger: customLogger });

// Register Swagger for API docs
app.register(fastifySwagger, {
  mode: 'static',
  specification: openApiDocument,
  exposeRoute: true,
});

// Register OpenAPI Glue
app.register(fastifyOpenapiGlue, {
  specification: './openapi.json',
  service,
  ajv: setCustomAjvOptions(),
});

// Add JWT authentication middleware
app.addHook('onRequest', authMiddleware);

// Error handler
app.setErrorHandler(errorHandler);

// Start the Fastify server
app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`Server listening at ${address}`);
});
