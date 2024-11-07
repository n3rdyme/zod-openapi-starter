import { Server, ServerCredentials } from "@grpc/grpc-js";
import { environment } from "../environment.mjs";
import { protoLoader } from "./protoLoader.mjs";
import { GrpcServerStub } from "./grpcServerStub.mjs";
import { grpcAuthorization } from "./grpcAuthorization.mjs";

let server: Server | undefined;

export async function startGrpc() {
  if (server) {
    throw new Error("Server already started");
  }

  const MyService = await protoLoader();

  server = new Server({});

  const service = new GrpcServerStub(MyService.service, MyService.spec);

  service.onBeforeCall = (args) => {
    args.context.logger.info(`GRPC call: ${args.name}`);
    return grpcAuthorization(args);
  };

  server.addService(MyService.service, service.stubs);

  server.bindAsync(
    `${environment.host ?? "localhost"}:${environment.port + 1}`,
    ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`GRPC running at http://0.0.0.0:${port}`);
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
