import { z } from "zod";
type RouteValidation = {
  body?: z.AnyZodObject;
  query?: z.AnyZodObject;
  params?: z.AnyZodObject;
  response?: z.AnyZodObject;
};

const ROUTE_VALIDATIONS = {
  "v1/users/auth/init": {
    response: z.object({
      data: z.object({
        url: z.string(),
      }),
    }),
  },
} as const;

export type RoutePaths = keyof typeof ROUTE_VALIDATIONS;

export const getSchemaForRoute = (
  path: RoutePaths
): (typeof ROUTE_VALIDATIONS)[RoutePaths] => {
  return ROUTE_VALIDATIONS[path];
};
