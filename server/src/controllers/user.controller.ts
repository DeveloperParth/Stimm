import { Request, Response } from "express";
import { initializeLoginSchema } from "../validation";
import { UserService } from "../services";

export class UserController {
  constructor(private readonly userService: UserService) {}
  async initializeLogin(req: Request, res: Response) {
    const data = initializeLoginSchema.parse(req.body);
    await this.userService.initializeLogin(data);
  }
}
