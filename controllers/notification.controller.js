const { NotificationService } = require("../services/notification.service");

const NotificationController = {
  getAllNotifications: async (req, res, next) => {
    const userId = +req.user.id;
    try {
      console.log({ userId });
      const { notifications, unseenCount, unseenMsgCount } =
        await NotificationService.getAllNotifications(userId);
      res.status(200).json({
        success: true,
        error: false,
        notifications,
        unseenCount,
        unseenMsgCount,
      });
    } catch (error) {
      next(error);
    }
  },

  createNotification: async (req, res, next) => {
    const notificationData = req.body;
    try {
      const notification = await NotificationService.createNotification(
        notificationData
      );
      res.status(201).json({
        success: true,
        error: false,
        message: "Notification created successfully",
        notification,
      });
    } catch (error) {
      next(error);
    }
  },

  updateNotification: async (req, res, next) => {
    const notificationId = Number(req.params.id);
    const updatedData = req.body;
    try {
      const [updatedRowsCount, updatedNotification] =
        await NotificationService.updateNotification(
          notificationId,
          updatedData
        );
      if (updatedRowsCount === 0) {
        next(new HttpException(404, "Notification not found"));
      } else {
        res.status(200).json({
          success: true,
          error: false,
          message: "Notification updated successfully",
          notification: updatedNotification,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  deleteNotification: async (req, res, next) => {
    const notificationId = Number(req.params.id);
    try {
      const deletedRowsCount = await NotificationService.deleteNotification(
        notificationId
      );
      if (deletedRowsCount === 0) {
        next(new HttpException(404, "Notification not found"));
      } else {
        res.json({ message: "Notification deleted successfully" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  markAllNotificationsAsSeen: async (req, res, next) => {
    const userId = +req.user.id;
    try {
      const updatedRowsCount =
        await NotificationService.markAllNotificationsAsSeen(userId);
      res.status(200).json({
        success: true,
        error: false,
        message: `${updatedRowsCount} notifications marked as seen`,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = { NotificationController };
