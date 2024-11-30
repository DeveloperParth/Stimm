require("dotenv").config();
import { UserController } from "../controllers";
import env from "../env";
import { Route } from "../types";
import { UserRoutes } from "./user.routes";

const userRoutes = new UserRoutes().routes();
const routes: Route[] = [...userRoutes];

export default routes;
