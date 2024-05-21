const { HttpException } = require("../exceptions/HttpException");
const { Op } = require("sequelize");
const NotificationModel = require("../models/notification.model");
const { UserModel } = require("../models/user.model");

const NotificationService = {
  getAllNotifications: async (id) => {
    try {
      const notifications = await NotificationModel.findAll({
        where: { receiverId: id, type: { [Op.not]: "new_message" } },
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: UserModel,
            as: "author",
            attributes: ["name", "id"],
          },
          {
            model: UserModel,
            as: "receiver",
            attributes: ["name", "id"],
          },
        ],
        attributes: { exclude: ["receiverId", "authorId"] },
      });

      const unseenCount = await NotificationModel.count({
        where: {
          receiverId: id,
          status: "delivered",
          type: { [Op.not]: "new_message" },
        },
      });

      const unseenMsgCount = await NotificationModel.count({
        where: {
          receiverId: id,
          status: "delivered",
          type: "new_message",
        },
      });

      return { notifications, unseenCount, unseenMsgCount };
    } catch (error) {
      throw new HttpException(
        500,
        "Error fetching notifications: " + error.message
      );
    }
  },
  createNotification: async (notificationData) => {
    try {
      let notification = await NotificationModel.create(notificationData);
      notification = await NotificationModel.findByPk(notification.id, {
        include: [
          {
            model: UserModel,
            as: "author",
            attributes: ["name", "id"],
          },
          {
            model: UserModel,
            as: "receiver",
            attributes: ["name", "id"],
          },
        ],
        attributes: { exclude: ["receiverId", "authorId"] },
      });
      return notification;
    } catch (error) {
      throw new HttpException(
        404,
        "Unable to create notification: " + error.message
      );
    }
  },
  updateNotification: async (notificationId, updatedData) => {
    try {
      const [updatedRowsCount, updatedNotification] =
        await NotificationModel.update(updatedData, {
          where: { id: notificationId },
          returning: true,
        });
      return [updatedRowsCount, updatedNotification];
    } catch (error) {
      throw new HttpException(
        404,
        "Unable to update notification: " + error.message
      );
    }
  },
  deleteNotification: async (notificationId) => {
    try {
      const deletedRowsCount = await NotificationModel.destroy({
        where: { id: notificationId },
      });
      return deletedRowsCount;
    } catch (error) {
      throw new HttpException(
        404,
        "Unable to delete notification: " + error.message
      );
    }
  },
  markAllNotificationsAsSeen: async (receiverId) => {
    try {
      const updatedRowsCount = await NotificationModel.update(
        { status: "seen" },
        {
          where: {
            receiverId,
            type: { [Op.not]: "new_message" },
          },
        }
      );
      return updatedRowsCount[0];
    } catch (error) {
      throw new Error(
        "Unable to mark all notifications as seen: " + error.message
      );
    }
  },
};

module.exports = { NotificationService };
