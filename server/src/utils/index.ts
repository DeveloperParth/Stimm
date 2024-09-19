import { RequestHandler } from "express";

export * from "./mail";

export const asyncHandler: (fn: RequestHandler) => RequestHandler =
  (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
