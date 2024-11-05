/* eslint-disable */
const { defineConfig } = require("orval");
const { JSONSchemaFaker } = require("json-schema-faker");
const openapiSpec = require("./dist/openapi.json");
const path = require("path");
const fs = require("fs");

const operations = {};

const serviceOutput = "../service/src/generated";
const clientOutput = "../client-sdk/src/generated";

module.exports = defineConfig({
  sdk: {
    output: {
      mode: "single",
      target: path.join(clientOutput, "sdk.mts"),
      schemas: path.join(clientOutput, "types/"),
      client: "fetch",
      fileExtension: ".mts",
      mock: false,
      prettier: false,
      override: {
        mutator: {
          path: path.join(clientOutput, "../sdkFetch.mts"),
          name: "sdkFetch",
        },
      },
    },
    hooks: {
      afterAllFilesWrite: () => {
        fixAllImportExtensions(clientOutput);
      },
    },
    input: {
      target: "./dist/openapi.json",
      parserOptions: {
        validate: false,
      },
    },
  },
  service: {
    output: {
      mode: "single",
      target: "../service/src/handlers/index.mts",
      schemas: "../service/src/generated",
      client: "fetch",
      fileExtension: ".mts",
      mock: false,
      prettier: false,
      override: {
        transformer: (arg) => {
          operations[arg.operationId] = arg;
          return arg;
        },
      },
    },
    hooks: {
      afterAllFilesWrite: () => {
        fixAllImportExtensions(serviceOutput);
        const getHandlersFile = path.join(serviceOutput, "../handlers/index.mts");
        // Ensure handlers directory exists
        const handlersDir = path.join(serviceOutput, "../handlers");
        if (!fs.existsSync(handlersDir)) {
          fs.mkdirSync(handlersDir, { recursive: true });
        }

        // Write handlers stub if missing
        Object.entries(operations)
          .map(([name, value]) => ({
            name,
            file: path.join(handlersDir, value?.tags?.[0] ?? ".", `${name}.mts`),
            value,
          }))
          .forEach((data) => {
            const folder = path.dirname(data.file);
            if (!fs.existsSync(folder)) {
              fs.mkdirSync(folder, { recursive: true });
            }
            if (!fs.existsSync(data.file)) {
              generateApiFunction(data);
            }
          });
        // Overwrite getHandlersFile
        generateGetHandlers(getHandlersFile);
      },
    },
    input: {
      target: "./dist/openapi.json",
      parserOptions: {
        validate: false,
      },
    },
  },
});

/**
 * Orval does not support .mjs files, so we need to convert all .mts files to .mjs imports
 * and add the .mjs extension to import statements that are missing it.
 */
function fixAllImportExtensions(directory) {
  directory = path.resolve(directory);
  const files = fs.readdirSync(directory);
  files.forEach((file) => {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isFile()) {
      if (file.endsWith(".mts")) {
        const content = fs.readFileSync(fullPath, "utf-8");
        let newContent = content.replace(/\.mts(['"])/g, ".mjs$1").replace(/\sfrom ["'](\.[^"']+)["']/g, (o, m) => {
          if (m.endsWith(".mjs")) {
            return o;
          }
          const fqName = path.resolve(path.join(directory, m));
          const isDir = fs.existsSync(fqName) && fs.statSync(fqName).isDirectory();
          const isMts = fs.existsSync(fqName + ".mts");
          const lastChar = o[o.length - 1];
          if (isDir) {
            return `${o.substring(0, o.length - 1)}/index.mjs${lastChar}`;
          } else if (isMts) {
            return `${o.substring(0, o.length - 1)}.mjs${lastChar}`;
          }
          throw new Error(`Could not resolve import ${o}`);
        });

        if (fullPath.endsWith("/index.mts")) {
          newContent =
            newContent
              .split("\n")
              .filter((l) => /^(import|export)/.test(l))
              .sort()
              .filter((l, i, a) => l !== a[i - 1])
              .join("\n") + "\n";
        }

        if (content !== newContent) {
          fs.writeFileSync(fullPath, newContent, "utf-8");
        }
      }
    } else {
      fixAllImportExtensions(fullPath);
    }
  });
}

function generateApiFunction({ name, file, value: { doc, ...value } }) {
  const imports = [
    ...(value.body?.imports ?? []),
    ...(value.params?.imports ?? []),
    ...(value.queryParams?.schema?.imports ?? []),
    ...(value.response?.imports ?? []),
  ]
    .filter(({ name }) => name !== "ErrorDetails") // ErrorDetails is not used directly, throw the appropriate error instead
    .reduce((acc, { name, schemaName }) => ({ ...acc, [name]: schemaName }), {});

  const reqType = !value.props?.length
    ? "unknown"
    : value.props
        .map((p) => {
          if (p.type === "body" || p.type === "queryParam") {
            return p.implementation.substring(p.implementation.indexOf(":") + 1).trim();
          }
          return `{ ${p.definition} }`;
        })
        .join(" & ");

  const resType = value.response?.definition?.success ?? "void";
  let sampleResponse = "";
  if (resType !== "void") {
    const schema = {
      components: openapiSpec.components,
      ...(value.response?.types?.success?.[0]?.originalSchema ?? { type: "object" }),
    };

    sampleResponse = " " + JSON.stringify(JSONSchemaFaker.generate(schema), null, 2).replace(/\n/g, "\n  ");
  }

  const query = value.queryParams?.schema?.model;
  const svcRoot = !value.tags?.[0] ? "../" : "../../";

  fs.writeFileSync(
    file,
    [
      `import type { ApiContext } from "${svcRoot}interfaces/apiContext.mjs";`,
      ...(Object.keys(imports).length
        ? [`import { ${Object.keys(imports).sort().join(", ")} } from "${svcRoot}generated/index.mjs";`]
        : []),
      ...(query ? ["", query] : []),
      ...(!doc ? [""] : [`${doc?.trim() ?? ""}`]),
      `export const ${name} = async (request: ${reqType}, context: ApiContext): Promise<${resType}> => {`,
      `  return${sampleResponse};`,
      `};`,
      // DEBUG:      ...["", `/* ${JSON.stringify(value, null, 2)} */`],
      ``,
    ].join("\n"),
    "utf-8",
  );
}

function generateGetHandlers(getHandlersFile) {
  fs.writeFileSync(
    getHandlersFile,
    [
      `/* eslint-disable */`,
      `type ServerStubFactory<T extends Function> = (`,
      `  name: string,`,
      `  impl: () => Promise<{ [key: string]: Function }>,`,
      `  successCode: string,`,
      `  contentType: string,`,
      `) => T;`,
      ``,
      `export const getHandlers = <T extends Function>(factory: ServerStubFactory<T>): { [key: string]: T } => ({`,
      ...Object.entries(operations).map(([name, value]) => {
        const success = value.response?.types?.success?.length !== 1 ? null : value.response.types.success[0];
        const successCode = success?.key ?? "200";
        const contentType = success?.contentType ?? "application/json";
        const pthName = value?.tags?.[0] ? `${value?.tags?.[0]}/${name}` : name;
        return `  ${name}: factory("${name}", () => import("./${pthName}.mjs"), "${successCode}", "${contentType}"),`;
      }),
      `});`,
      ``,
    ].join("\n"),
    "utf-8",
  );
}
