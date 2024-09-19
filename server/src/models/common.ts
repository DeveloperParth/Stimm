import { sql } from "drizzle-orm";
import { timestamp } from "drizzle-orm/pg-core";

const commonColumns = {
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => sql`current_timestamp`),
};

export { commonColumns };
