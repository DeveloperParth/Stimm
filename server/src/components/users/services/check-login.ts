import { loginSchema, LoginSchema } from "validations/login";
import { db } from "../../../lib/db";
import AppError from "../../../lib/app-error";

export default async (data: unknown | LoginSchema) => {
  const loginData = loginSchema.parse(data);
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, loginData.email),
  });
  if (!user) {
    throw new AppError({
      status: 404,
      message: "Invalid email or password",
    });
  }
  //implement password check
  return {
    user: {
      ...user,
      password: undefined,
    },
  };
};
