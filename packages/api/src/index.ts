import { generateOpenApiDocument } from 'zod-to-openapi';
import { schema } from './schemas';

const openApiDocument = generateOpenApiDocument([schema], {
  title: 'API Documentation',
  version: '1.0.0'
});

// Export generated OpenAPI spec
export default openApiDocument;
