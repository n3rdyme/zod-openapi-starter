/* eslint-disable @typescript-eslint/no-explicit-any */
import * as grpc from "@grpc/grpc-js";
import * as loader from "@grpc/proto-loader";
import { TodoListService } from "./generated/example/todo/TodoListService.js";

import path from "path";
import { fileURLToPath } from "url";

type ServiceClientCtor = new (binding: string, security: grpc.ChannelCredentials) => TodoListService;

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

  // Create Lookup for Service Methods
  const lookup: { [key: string]: any } = {};
  Object.values(yourService.service).forEach((value: any) => {
    lookup[value.originalName] = value.requestType?.type;
  });

  function bindClient(this: any, binding: string, security: grpc.ChannelCredentials) {
    this.impl = new yourService(binding, security);
    for (const method of Object.keys(this.impl.constructor.prototype)) {
      const call = this.impl[method].bind(this.impl);
      this[method] = (req: any) => {
        return new Promise((done, reject) =>
          call(req, (err: Error, response: any) => {
            if (err) {
              return reject(err);
            }
            done(response);
          }),
        );
      };
    }
  }

  return bindClient as unknown as ServiceClientCtor;
}
