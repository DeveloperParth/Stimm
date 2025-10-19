import { Request } from "express";
import { loginUser } from "./handlers";

export default [
  { path: "/users/login", method: "POST", handler: loginUser },
  {
    path: "/users/login",
    method: "GET",
    handler: async (req: Request, res: Response) => {
      return { message: "Login endpoint" };
    },
  },
] as const;
