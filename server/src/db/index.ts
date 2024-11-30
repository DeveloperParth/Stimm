import { drizzle } from "drizzle-orm/node-postgres";
import env from "../env";
import * as schema from "./models";

export const db = drizzle(
  {
    connection: {
      host: env.db.HOST,
      user: env.db.USER,
      password: env.db.PASSWORD,
      database: env.db.DATABASE,
    },
  },
  { schema }
);
