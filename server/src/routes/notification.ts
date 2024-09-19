import { Router } from "express";
import checkUser from "./../middlewares/checkUser";
import db from "@/config/db";
import { notifications } from "@/models";
import { count, eq } from "drizzle-orm";
import { asyncHandler } from "@/utils";

const router = Router();

router.get(
  "/notifications",
  checkUser,
  asyncHandler(async (_, res) => {
    const notificationArraya = await db
      .select()
      .from(notifications)
      .where(eq(notifications.user_id, res.locals.user?._id))
      .orderBy(notifications.created_at);
    return res.status(200).json({ notifications: notificationArraya });
  })
);
router.get(
  "/notifications/count",
  checkUser,
  asyncHandler(async (_, res) => {
    const notificationCount = await db
      .select({
        count: count(),
      })
      .from(notifications)
      .where(eq(notifications.user_id, res.locals.user?._id));
    return res.status(200).json({ count: notificationCount });
  })
);
router.post(
  "/notifications/read",
  checkUser,
  asyncHandler(async (_, res) => {
    const deletedNotifications = await db
      .delete(notifications)
      .where(eq(notifications.user_id, res.locals.user?._id))
      .returning()
      .execute();
    return res.status(200).json({ notifications: deletedNotifications });
  })
);

module.exports = router;
