/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { environment } from "../environment.mjs";
import { protoLoader } from "./protoLoader.mjs";

let server: Server | undefined;

export async function startGrpc() {
  if (server) {
    throw new Error("Server already started");
  }

  const MyService = protoLoader();

  server = new Server({});

  server.addService(MyService.service, {
    login: (call: any, callback: any) => {
      callback(null, { token: "token-data" });
    },
    yourMethod: (call: any, callback: any) => {
      callback(null, {});
    },
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
