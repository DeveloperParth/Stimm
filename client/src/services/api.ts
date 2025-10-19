import axios, { type AxiosRequestConfig } from "axios";
import type { AppRoutes } from "../../../server/src/routes";

// app routes by "Method Path" structure
type AppRoutesByMethodAndPath = {
  [K in AppRoutes as `${K["method"]} ${K["path"]}`]: K;
};

export const api = axios.create({
  baseURL: "http://localhost:3000",
});

const get = async <Path extends AppRoutes["path"]>(
  endpoint: Path,
  config?: AxiosRequestConfig
): Promise<
  AppRoutesByMethodAndPath[`GET ${Path}`] extends {
    handler: (...args: any[]) => Promise<infer R>;
  }
    ? R
    : AppRoutesByMethodAndPath[`GET ${Path}`] extends {
        handler: (...args: any[]) => infer R;
      }
    ? R
    : never
> => {
  const response = await api.get(endpoint, config);
  return response.data;
};

const post = async <Path extends AppRoutes["path"]>(
  endpoint: Path,
  data?: any,
  config?: AxiosRequestConfig
): Promise<
  AppRoutesByMethodAndPath[`POST ${Path}`] extends {
    handler: (...args: any[]) => Promise<infer R>;
  }
    ? R
    : AppRoutesByMethodAndPath[`POST ${Path}`] extends {
        handler: (...args: any[]) => infer R;
      }
    ? R
    : never
> => {
  const response = await api.post(endpoint, data, config);
  return response.data;
};

const response = await get("/users/login");

response.message.trim();

const postResponse = await post("/users/login");

postResponse.success.toString();
