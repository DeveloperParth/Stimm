import { RequestHandler, Request, Response } from "express";
import checkLogin from "./services/check-login";

export const loginUser = async (req: Request, res: Response) => {
  const { user } = await checkLogin(req.body);
  res.cookie("session", user.id);
  return { success: true };
};
