import env from "@/env";
import { UnauthorizedError } from "@/utils/errors";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

const optionalAuth: RequestHandler = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) return next();
    if (token.startsWith("Bearer")) {
      token = token.split(" ")[1];
    }
    let decoded = jwt.verify(token, env.tokens.access_secret);
    if (decoded) {
      res.locals.user = decoded;
      next();
    } else {
      throw new UnauthorizedError("Invalid");
    }
  } catch (error) {
    next();
  }
};

export default optionalAuth;
