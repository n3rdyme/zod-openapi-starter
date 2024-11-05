/**
 * PURPOSE: Repair a gnostic-generated proto file by removing unused fields and adding missing fields.
 *
 * gnostic-grpc generates a wholly new "request" object for each operation which then deviates from
 * the original OpenAPI spec. This script repairs the generated proto file by removing these types.
 * Note that we already defined "{operation}Request" in the prepare script, so we simply remove them
 * here.
 *
 * Additionally, we add the "optional" keyword to fields that are not required in the OpenAPI spec.
 *
 * Lastly, we replace the service name and package name with the values specified in the OpenAPI spec.
 *
 */
import fs from "fs-extra";

async function main() {
  const inputPath = process.argv[2];
  const protoPath = process.argv[3] || inputPath;

  if (!inputPath || !protoPath) {
    console.error("Please specify the path to the input OpenAPI JSON file.");
    process.exit(1);
  }

  try {
    const openapiSpec = await fs.readJSON(inputPath);
    let protoText = fs.readFileSync(protoPath, "utf8");

    protoText = protoText.replace(/\/\/\w+ holds parameters to.*(\n[^}].*)*\n\}/g, "");
    protoText = protoText.replace(/body:\s*"\w+"\s*/g, "");
    protoText = protoText
      .replace(/\n\n+/g, "\n")
      .replace(/\nmessage/, "\n\nmessage")
      .replace(/\}\n/g, "}\n\n")
      .replace(/\n\n\}/g, "\n}");

    // Process each path and operation in the OpenAPI spec
    for (const [originalPath, pathItem] of Object.entries(openapiSpec.paths)) {
      if (!pathItem) continue;

      for (const [method, operation] of Object.entries(pathItem)) {
        if (operation["x-original-path"]) {
          protoText = protoText.replace(originalPath, operation["x-original-path"]);
        }
      }
    }

    // protoText = protoText.replace("string description", "optional string description");
    for (const [name, schema] of Object.entries(openapiSpec.components.schemas)) {
      const optional = Object.keys(schema.properties ?? []).filter((p) => !schema.required?.includes(p));
      protoText = !optional.length
        ? protoText
        : protoText.replace(new RegExp(`message ${name}(\\n|.)*?\\n\\}`, "g"), (m) => {
            optional.forEach((p) => {
              m = m.replace(new RegExp(`(\\s+)[\\w\\.]+ ${p} =`, "g"), (m, sp) => sp + "optional " + m.trim());
            });
            return m;
          });
    }

    if (openapiSpec.info?.["x-service-name"]) {
      protoText = protoText.replace(/\nservice\s+\w+/, `\nservice ${openapiSpec.info["x-service-name"]}`);
    }
    if (openapiSpec.info?.["x-package-name"]) {
      protoText = protoText.replace(/\npackage .*;/, `\npackage ${openapiSpec.info["x-package-name"]};`);
    }

    fs.writeFileSync(protoPath, protoText, "utf-8");
  } catch (error) {
    console.error("Error processing OpenAPI spec:", error);
    process.exit(1);
  }
}

main();
