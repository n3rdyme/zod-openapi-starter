import { fastifyStub } from "./fastifyStub.mjs";
import { getHandlers } from "../handlers/index.mjs";

export const fastifyHandlers = getHandlers(fastifyStub);
