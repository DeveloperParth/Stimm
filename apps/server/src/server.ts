import express from "express";
import { IServer, IServerConfig, Route } from "./types";
import { asyncHandler } from "./utils";
import cors from "cors";

class Server implements IServer {
  private app: express.Application;
  private routes: Route[];
  private port: number;
  private config: IServerConfig;

  constructor(config: IServerConfig) {
    this.app = express();
    this.routes = config.routes;
    this.port = config.port || 3000;
    this.config = config;
  }
  private setupRoutes(routes?: Route[]): void {
    routes = routes || this.routes;
    routes.forEach((route) => {
      if (route.routes) {
        this.setupRoutes(route.routes);
        return;
      }
      const middlewares = route.middlewares || [];

      this.app[route.method](
        route.path,
        ...middlewares,
        asyncHandler(route.handler)
      );
    });
  }
  public start(port?: number): void {
    if (port) this.port = port;

    if (this.config.useJSON) this.app.use(express.json());
    if (this.config.urlEncoded)
      this.app.use(express.urlencoded({ extended: true }));
    if (this.config.cors) {
      this.app.use(cors({ origin: this.config.cors }));
    }
    this.setupRoutes();

    this.app.use((err, req, res, next) => {
      console.error(err);
      res.status(500).send("Something went wrong");
    });

    this.app.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`);
    });
  }
}

export default Server;
