require("dotenv").config();
import env from "./env";
import routes from "./routes";
import Server from "./server";

const server = new Server({
  routes: routes,
  port: env.port,
  urlEncoded: true,
  useJSON: true,
  cors: "*",
});
// todo: move this to separate process
require("@/workers/start-workers");
server.start();
