import Ajv, { Options } from "ajv";
import AjvFormats from "ajv-formats";
import AjvErrors from "ajv-errors"; // Example plugin if needed

export const ajvDefaultOptions: Options = {
  allErrors: true, // Required by ajv-errors, singleError: true
  strict: false, // Adjust strict mode if needed
  coerceTypes: true,
  useDefaults: true,
  removeAdditional: "all",
};

export function createAjv(opts?: Options) {
  const ajv = new Ajv({
    ...ajvDefaultOptions,
    ...opts,
  });

  // Add plugins or custom keywords to the AJV instance
  AjvFormats(ajv, { mode: "full" });
  AjvErrors(ajv, { singleError: true });

  return ajv;
}
