import { start, stop } from "./main.mjs";
import { fastify } from "./fastifyService.mjs";

vi.mock("./fastifyService.mjs", () => ({
  fastify: {
    listen: () => {},
    close: () => {},
  },
}));

describe("service:main", () => {
  it("Start should call listen on fastify", async () => {
    const listen = vi.spyOn(fastify, "listen");
    const close = vi.spyOn(fastify, "close");

    await start();

    expect(listen).toHaveBeenCalledOnce();
    expect(listen).toHaveBeenCalledWith(expect.objectContaining({ port: 3000 }), expect.any(Function));

    await stop();

    expect(close).toHaveBeenCalledOnce();
  });
});
