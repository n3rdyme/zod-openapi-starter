/* eslint-disable @typescript-eslint/no-explicit-any */
import * as grpc from "@grpc/grpc-js";
import * as loader from "@grpc/proto-loader";
import { ClientCalls } from "./generated/client.mjs";

import path from "path";
import { fileURLToPath } from "url";

type ServiceClientCtor = new (binding: string, security: grpc.ChannelCredentials) => ClientCalls;

// Convert import.meta.url to a file path and then get the directory name

export function protoLoader(): ServiceClientCtor {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const protoPath = path.join(__dirname, "./proto/");
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

  function bindClient(this: any, binding: string, security: grpc.ChannelCredentials) {
    this.impl = new yourService(binding, security);
    for (const method of Object.keys(this.impl.constructor.prototype)) {
      const call = this.impl[method].bind(this.impl);
      this[method] = (req: any) =>
        new Promise((done, reject) =>
          call(req, (err: Error, response: any) => {
            if (err) {
              return reject(err);
            }
            done(response);
          }),
        );
    }
  }

  return bindClient as unknown as ServiceClientCtor;
}
