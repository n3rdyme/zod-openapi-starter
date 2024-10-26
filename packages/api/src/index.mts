import openapi from "./openapi.json" with { type: "json" };

// eslint-disable-next-line import/extensions
import { type paths, type components, type operations } from "./openapi.js";

export type api = { paths: paths; components: components; operations: operations };

export default openapi;
