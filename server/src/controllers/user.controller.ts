import { Request, Response } from "express";
import {
  InitializeLoginSchema,
  initializeLoginSchema,
  verifyLoginSchema,
} from "../validation";
import { UserService } from "../services";

export class UserController {
  constructor(private readonly userService: UserService) {}
  async initializeLogin(req: Request, res: Response) {
    const data = initializeLoginSchema.parse(req.body);
    await this.userService.initializeLogin(data);
    res.status(200).json({
      message: "OTP sent to your email",
    });
    return;
  }
  async verifyLogin(req: Request, res: Response) {
    const data = verifyLoginSchema.parse(req.body);
    await this.userService.verifyLogin(data);
    res.json({
      message: "Login successful",
    });
  }
  async getMe(req: Request, res: Response) {
    const userId = req.user.id;
    const user = await this.userService.findUserById(userId, true);
    res.json({
      data: user,
    });
  }
}
