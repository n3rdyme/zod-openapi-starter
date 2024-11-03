import * as grpc from "@grpc/grpc-js";
import * as loader from "@grpc/proto-loader";

import path from "path";
import { fileURLToPath } from "url";

// Convert import.meta.url to a file path and then get the directory name

export function protoLoader(): { service: grpc.ServiceDefinition } {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const protoPath = path.join(__dirname, "../proto/");
  const protoService = path.join(protoPath, "openapiService/openapiService.proto");

  // Load the protobuf file
  const packageDefinition = loader.loadSync(protoService, {
    keepCase: true,
    longs: Number,
    enums: String,
    defaults: true,
    oneofs: true,
    includeDirs: [protoPath],
  });

  // Get the package and service definitions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const protoDescriptor: any = grpc.loadPackageDefinition(packageDefinition);
  const yourService = protoDescriptor.openapiService.OpenapiService;
  return yourService;
}
