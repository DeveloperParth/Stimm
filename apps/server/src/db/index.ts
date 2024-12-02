import { drizzle } from "drizzle-orm/node-postgres";
import env from "../env";
import * as schema from "./models";
import { Pool } from "pg";
const pool = new Pool({
  user: env.db.USER,
  host: env.db.HOST,
  database: env.db.DATABASE,
  password: env.db.PASSWORD,
});

export const db = drizzle(pool, { schema });
