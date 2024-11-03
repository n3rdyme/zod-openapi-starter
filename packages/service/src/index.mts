import { startGrpc } from "./grpc/main.mjs";
import { startFastify } from "./service/main.mjs";
startFastify();
startGrpc();
