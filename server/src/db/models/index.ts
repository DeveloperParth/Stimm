import { relations, sql } from "drizzle-orm";
import {
  AnyPgColumn,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { v4 } from "uuid";

const commonFields = {
  id: varchar()
    .$defaultFn(() => {
      return v4();
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
  posts: many(posts),
  comments: many(comments),
  votes: many(votes),
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

// --- posts start ---
export const posts = pgTable("posts", {
  content: text().notNull(),
  userId: varchar()
    .notNull()
    .references(() => users.id),
  ...commonFields,
});

export type Post = typeof posts.$inferSelect;

export const postRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  comments: many(comments),
  votes: many(votes),
}));

// --- posts end ---

// --- comments start ---
export const comments = pgTable("comments", {
  content: text().notNull(),
  userId: varchar()
    .notNull()
    .references(() => users.id),
  postId: varchar()
    .notNull()
    .references(() => posts.id),
  parentId: varchar().references((): AnyPgColumn => comments.id),
  ...commonFields,
});

export type Comment = typeof comments.$inferSelect;

export const commentRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
  }),
  children: many(comments),
}));

// --- comments end ---

// --- votes start ---
export const votes = pgTable("votes", {
  userId: varchar()
    .notNull()
    .references(() => users.id),
  postId: varchar()
    .notNull()
    .references(() => posts.id),
  value: integer().notNull(),
  ...commonFields,
});

export type Vote = typeof votes.$inferSelect;

export const voteRelations = relations(votes, ({ one }) => ({
  user: one(users, {
    fields: [votes.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [votes.postId],
    references: [posts.id],
  }),
}));

// --- votes end ---
