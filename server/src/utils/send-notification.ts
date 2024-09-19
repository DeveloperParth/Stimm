import db from "@/config/db";
import { NotificationPayload, notifications } from "@/models";

async function sendNotification(payload: NotificationPayload) {
  const notification = await db.insert(notifications).values(payload).execute();
  global.users[payload.user_id]?.emit("notification", payload.body);
}
module.exports = { sendNotification };
