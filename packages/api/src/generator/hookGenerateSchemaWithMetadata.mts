/* eslint-disable @typescript-eslint/no-explicit-any */
import { OpenApiGeneratorV3, OpenApiGeneratorV31 } from "@asteasolutions/zod-to-openapi";
import type { ZodType } from "zod";

const errorMessageKey = "x-errorMessage";

const setErrorMessage = (record: any, msgKey?: string, message?: string) => {
  if (!msgKey || !message || typeof message !== "string") {
    return;
  }
  record[errorMessageKey] = record[errorMessageKey] || {};
  record[errorMessageKey][msgKey] = message;
};

const unwrapAll = (zodSchema: any) =>
  [zodSchema.unwrap?.(), zodSchema?._def?.innerType, zodSchema?._def?.schema, zodSchema].filter((i) => !!i);
const unwrap = (zodSchema: any) =>
  zodSchema.unwrap?.() || zodSchema?._def?.innerType || zodSchema?._def?.schema || zodSchema;

const stringErrors: { [key: string]: string | undefined } = {
  min: "minLength",
  max: "maxLength",
  regex: "pattern",
  // supported formats
  uuid: "format",
  email: "format",
  uri: "format",
  "date-time": "format",
  cuid: "format",
  cuid2: "format",
  ulid: "format",
  ip: "format",
  emoji: "format",
};

export function hookGenerateSchemaWithMetadata<T extends OpenApiGeneratorV3 | OpenApiGeneratorV31>(generator: T): T {
  const openGen = (generator as any).generator;

  const original: any = openGen.generateSchemaWithMetadata;

  openGen.generateSchemaWithMetadata = function (zodSchema: ZodType<any>) {
    const result = original.call(this, zodSchema);
    if (result?.type === "string") {
      const zod = unwrap(zodSchema);
      const checks = (zod?._def as any).checks;
      checks?.forEach(({ kind, message }: any) => setErrorMessage(result, stringErrors[kind], message));
      return result;
    } else if (result?.type === "integer") {
      const zod = unwrap(zodSchema);
      const checks = (zod?._def as any).checks;
      const { min, max, int } = [checks ?? []].reduce((acc: any, i: any) => (i.kind ? [...acc, i.kind] : acc), []);
      setErrorMessage(result, "format", int?.message);
      setErrorMessage(result, int?.inclusive ? "minimum" : "exclusiveMinimum", min?.message);
      setErrorMessage(result, int?.inclusive ? "maximum" : "exclusiveMaximum", max?.message);
      return result;
    } else if (result?.type === "object") {
      const allowUnknown = !!unwrapAll(zodSchema).find((z) => z._def?.unknownKeys === "passthrough");
      if (allowUnknown) {
        result.additionalProperties = true;
      }
    } else if (result.nullable && unwrap(zodSchema)._def?.typeName === "ZodAny") {
      delete result.nullable;
      result.oneOf = [
        { type: "object", properties: {}, additionalProperties: true },
        { type: "string" },
        { type: "number" },
        { type: "boolean" },
      ];
    }

    return result;
  };

  return generator;
}
