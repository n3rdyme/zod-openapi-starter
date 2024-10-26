import openapi from "./openapi.json" with { type: "json" };

/**
 * To use openapi-typescript to generate types, you can add the following to package.json
 * "build:types": "NODE_NO_WARNINGS=1 openapi-typescript ./dist/openapi.json -o ./dist/openapi.d.ts",
 *
 * Then uncomment the code below to export the types from this package.
 */
// import { type paths, type components, type operations } from "./openapi.js";
// export type api = { paths: paths; components: components; operations: operations };

export default openapi;
