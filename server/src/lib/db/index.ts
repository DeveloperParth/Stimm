import { drizzle } from "drizzle-orm/node-postgres";
import env from "../env";

import * as models from "./models";

export const db = drizzle(env.DATABASE_URL, {
  schema: models,
});
export { models };
