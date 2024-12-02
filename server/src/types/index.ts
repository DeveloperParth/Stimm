import { RequestHandler } from "express";

export type HTTPMethod = "get" | "post" | "put" | "delete";
export type Route =
  | {
      routes?: never;
      path: string;
      method: HTTPMethod;
      handler: RequestHandler;
      middlewares?: RequestHandler[];
    }
  | {
      routes: Route[];
      path: string;
      middlewares?: RequestHandler[];
    };

export interface IServer {
  start(port: number): void;
}

export interface IServerConfig {
  port?: number;
  routes: Route[];
  useJSON?: boolean;
  urlEncoded?: boolean;
  cors?: string;
}
