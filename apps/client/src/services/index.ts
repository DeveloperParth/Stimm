import axios from "axios";
import {
  VerifyLoginSchema,
  type InitializeLoginSchema,
} from "@stimm/validation";
const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

export const initializeLogin = async (data: InitializeLoginSchema) =>
  api.post("/v1/users/login/initialize", data);

export const verifyLogin = async (data: VerifyLoginSchema) =>
  api.post("/v1/users/login/verify", data);
