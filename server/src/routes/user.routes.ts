import { UserController } from "../controllers";
import { MailService, UserService } from "../services";
import { Route } from "../types";

export class UserRoutes {
  private userController: UserController;
  constructor() {
    const mailService = new MailService();
    const userservice = new UserService(mailService);
    this.userController = new UserController(userservice);
  }
  public routes(): Route[] {
    return [
      {
        method: "post",
        path: "/api/v1/users/login/initialize",
        handler: this.userController.initializeLogin.bind(this.userController),
      },
    ];
  }
}
