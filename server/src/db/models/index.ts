import exp from "constants";
import { relations, sql } from "drizzle-orm";
import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

const commonFields = {
  id: varchar()
    .$defaultFn(() => {
      // todo: generate uuid
      return "";
    })
    .notNull()
    .primaryKey(),

  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .$onUpdate(() => sql`current_timestamp`),
};

// --- users start ---

export const users = pgTable("users", {
  email: varchar().notNull().unique(),
  ...commonFields,
});
export type User = typeof users.$inferSelect;

export const userRelations = relations(users, ({ many }) => ({
  otp: many(otps),
}));

// --- users end ---
// --- otps start ---

export const otps = pgTable("otps", {
  userId: varchar()
    .notNull()
    .references(() => users.id),
  otp: integer().notNull(),
  ...commonFields,
});
export type OTP = typeof otps.$inferSelect;

export const otpRelations = relations(otps, ({ one }) => ({
  user: one(users, {
    fields: [otps.userId],
    references: [users.id],
  }),
}));

// --- otps end ---
