/* eslint-disable @typescript-eslint/no-explicit-any */
import * as grpc from "@grpc/grpc-js";
import * as loader from "@grpc/proto-loader";
import { TodoListService } from "./generated/example/todo/TodoListService.js";

import path from "path";
import { fileURLToPath } from "url";

type ServiceClientCtor = new (
  binding: string,
  security: grpc.ChannelCredentials,
) => TodoListService & {
  grpcMetadataIn: grpc.Metadata;
  grpcMetadataOut: grpc.Metadata;
};

export async function protoLoader(): Promise<ServiceClientCtor> {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const protoPath = path.join(__dirname, "./proto/");
  const protoService = path.join(protoPath, "serviceSpec.proto");
  const { default: serviceSpec } = await import("./proto/serviceSpec.json", { with: { type: "json" } });

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

  // Create Lookup for Service Methods
  const lookup: { [key: string]: any } = {};
  Object.values(yourService.service).forEach((value: any) => {
    lookup[value.originalName] = value.requestType?.type;
  });

  function bindClient(this: any, binding: string, security: grpc.ChannelCredentials) {
    this.impl = new yourService(binding, security);
    this.grpcMetadataIn = new grpc.Metadata();
    this.grpcMetadataOut = new grpc.Metadata();

    for (const method of Object.keys(this.impl.constructor.prototype)) {
      const call = this.impl[method].bind(this.impl);
      this[method] = (req: any) => {
        this.grpcMetadataOut = new grpc.Metadata();

        return new Promise((done, reject) =>
          call(req, this.grpcMetadataIn, (err: Error, response: any, trailer: grpc.Metadata) => {
            if (trailer) {
              this.grpcMetadataOut = trailer;
            }
            if (err) {
              return reject(Object.assign(err, { metadata: trailer?.getMap?.() ?? {} }));
            }
            done(response);
          }),
        );
      };
    }
  }

  return bindClient as unknown as ServiceClientCtor;
}
