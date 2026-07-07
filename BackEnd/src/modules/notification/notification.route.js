import { Router } from "express";
import {
  getNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "./notification.controller.js";
import { auth } from "../../middleware/verifyToken.js";

const router = Router();

router.use(auth);

router.get("/",           getNotifications);
router.get("/unread",     getUnreadNotifications);
router.patch("/read-all", markAllAsRead);
router.patch("/:id/read", markAsRead);
router.delete("/:id",     deleteNotification);

export default router;
