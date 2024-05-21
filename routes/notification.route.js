const express = require("express");
const { ensureAuth } = require("../middlewares/auth.middleware");
const { NotificationController } = require("../controllers/notification.controller");
const router = express.Router();

router.get(
  "/notifications",
  ensureAuth,
  NotificationController.getAllNotifications
);
router.post(
  "/notifications/create",
  ensureAuth,
  NotificationController.createNotification
);
router.patch(
  "/notifications/update-status/:notificationId",
  ensureAuth,
  NotificationController.updateNotification
);
router.patch(
  "/notifications/seen-all",
  ensureAuth,
  NotificationController.markAllNotificationsAsSeen
);
router.delete(
  "/notifications/delete/:notificationId",
  ensureAuth,
  NotificationController.deleteNotification
);

module.exports = router;
