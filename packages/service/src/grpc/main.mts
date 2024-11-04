/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { environment } from "../environment.mjs";
import { protoLoader } from "./protoLoader.mjs";
import { grpcCallStub, TCall } from "./grpcCallStub.mjs";

let server: Server | undefined;

export async function startGrpc() {
  if (server) {
    throw new Error("Server already started");
  }

  const MyService = protoLoader();

  server = new Server({});

  // Create Lookup for Service Methods
  const lookup: { [key: string]: any } = {};
  Object.values(MyService.service).forEach((value: any) => {
    lookup[value.originalName] = value.requestType?.type;
  });

  server.addService(MyService.service, {
    ...Object.entries(lookup).reduce(
      (acc, [name, type]) => {
        acc[name] = (call, callback) => grpcCallStub(MyService, name, type, call, callback as any);
        return acc;
      },
      {} as { [key: string]: TCall },
    ),
  });

  server.bindAsync(
    `${environment.host ?? "localhost"}:${environment.port + 1}`,
    ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`GRPC running at http://0.0.0.0:${port}`);
      server?.start();
    },
  );
}

export async function stopGrpc() {
  const stopServer = server;
  server = undefined;

  await new Promise<void>((resolve) => {
    if (stopServer) {
      stopServer.tryShutdown((e) => {
        if (e) {
          stopServer.forceShutdown();
        }
        resolve();
      });
    }
  });
}
