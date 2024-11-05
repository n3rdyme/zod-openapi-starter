import * as grpc from "@grpc/grpc-js";
import * as loader from "@grpc/proto-loader";
import type { OpenAPIV3 } from "openapi-types";

import path from "path";
import { fileURLToPath } from "url";

// Convert import.meta.url to a file path and then get the directory name

export async function protoLoader(): Promise<{ service: grpc.ServiceDefinition; spec: OpenAPIV3.Document }> {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const protoPath = path.join(__dirname, "../proto/");
  const protoService = path.join(protoPath, "serviceSpec.proto");
  const { default: serviceSpec } = await import("../proto/serviceSpec.json", { with: { type: "json" } });

  // Load the protobuf file
  const packageDefinition = loader.loadSync(protoService, {
    keepCase: true,
    longs: Number,
    enums: String,
    defaults: false,
    oneofs: true,
    includeDirs: [protoPath],
  });

  // Get the package and service definitions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const protoDescriptor: any = grpc.loadPackageDefinition(packageDefinition);
  // navigate to the service definition by the path from protoDescriptor
  const svcPath = `${serviceSpec.info["x-package-name"]}.${serviceSpec.info["x-service-name"]}`.split(".");
  let yourService = protoDescriptor;
  for (const p of svcPath) {
    yourService = yourService?.[p];
  }
  if (!yourService) {
    throw new Error("Service not found in proto: " + svcPath.join("."));
  }

  return { service: yourService.service, spec: serviceSpec as OpenAPIV3.Document };
}
