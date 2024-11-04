/* eslint-disable @typescript-eslint/no-explicit-any */
import * as grpc from "@grpc/grpc-js";
import * as loader from "@grpc/proto-loader";
import { ClientCalls } from "./generated/client.mjs";

import path from "path";
import { fileURLToPath } from "url";

type ServiceClientCtor = new (binding: string, security: grpc.ChannelCredentials) => ClientCalls;

// Convert import.meta.url to a file path and then get the directory name
function fixRequest(req: any, type: any) {
  if (type == null || !Array.isArray(type.field)) {
    return req;
  }
  const passThrough = new Set(type.field.map((field: any) => field.name));
  const requestParts: { [key: string]: any } = {};
  const bodyParts: { [key: string]: any } = {};

  for (const [key, value] of Object.entries(req)) {
    if (passThrough.has(key)) {
      requestParts[key] = value;
    } else {
      bodyParts[key] = value;
    }
  }

  if (Object.keys(bodyParts).length > 0) {
    const bodyType = type.field.find((field: any) => field.type === "TYPE_MESSAGE");
    if (!bodyType) {
      throw new Error("No body type found: " + JSON.stringify(type.field));
    }
    requestParts[bodyType.name] = bodyParts;
  }

  return requestParts;
}

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
        const requestParts = fixRequest(req, lookup[method]);
        return new Promise((done, reject) =>
          call(requestParts, (err: Error, response: any) => {
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
