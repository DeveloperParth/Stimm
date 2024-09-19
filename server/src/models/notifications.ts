import { InferInsertModel } from "drizzle-orm";
import { boolean, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { commonColumns } from "./common";

const notificationTypeEnum = pgEnum("notification_type", [
  "info",
  "warning",
  "error",
]);

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey(),
  user_id: uuid("user_id").notNull(),
  body: text("body").notNull(),
  unread: boolean("unread").notNull().default(true),
  type: notificationTypeEnum("type").notNull(),
  ...commonColumns,
});

export type NotificationPayload = InferInsertModel<typeof notifications>;
