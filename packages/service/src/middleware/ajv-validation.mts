import Ajv, { Options } from "ajv";
import AjvFormats from "ajv-formats";
import AjvErrors from "ajv-errors"; // Example plugin if needed

export function createAjv(opts?: Options) {
  const ajv = new Ajv({
    allErrors: true,
    strict: false, // Adjust strict mode if needed
    coerceTypes: true,
    useDefaults: true,
    removeAdditional: "all",
    ...opts,
  });

  // Add plugins or custom keywords to the AJV instance
  AjvFormats(ajv, { mode: "full" });
  AjvErrors(ajv, { singleError: true });

  return ajv;
}
