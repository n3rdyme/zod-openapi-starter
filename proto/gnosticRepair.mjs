import fs from "fs-extra";
import path from "path";

async function main() {
  //\w+ holds parameters to.*(\n[^}].*)*\n\}

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
