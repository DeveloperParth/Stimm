import { verify, TokenExpiredError } from "jsonwebtoken";
import Mongoose from "mongoose";
import { RequestHandler } from "express";
import env from "@/env";
import { UnauthorizedError } from "@/utils/errors";

const checkUser: RequestHandler = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) throw new UnauthorizedError("Token not provided");
    if (token.startsWith("Bearer")) {
      token = token.split(" ")[1];
    }
    let decoded = verify(token, env.tokens.access_secret);
    if (decoded) {
      res.locals.user = decoded;
      next();
    } else {
      throw new UnauthorizedError("Invalid");
    }
  } catch (error) {
    if (error instanceof TokenExpiredError)
      next(new UnauthorizedError("Session expired"));
    next(error);
  }
};

export default checkUser;
