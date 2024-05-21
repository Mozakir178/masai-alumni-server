const { HttpException } = require("../exceptions/HttpException");
const { privateMessageModel } = require("../models/privateMessage.model");
const { Op } = require("sequelize");
const { UserModel } = require("../models/user.model");
const NotificationModel = require("../models/notification.model");

const privateMessageService = {
  privateMessageModel: privateMessageModel,

  getAllMessages: async (currentOnlineUserId, id, page = 1, pageSize = 20) => {
    try {
      const offset = (page - 1) * pageSize;
      const messages = await privateMessageService.privateMessageModel.findAll({
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                { receiverId: currentOnlineUserId },
                { authorId: currentOnlineUserId },
              ],
            },
            {
              [Op.or]: [{ receiverId: id }, { authorId: id }],
            },
          ],
        },
        order: [["createdAt", "DESC"]],
        limit: pageSize,
        offset: offset,
      });
      const user = await UserModel.findByPk(id, {
        attributes: ["name", "isOnline", "user_profile_photo_path", "id"],
      });
      return { messages, user };
    } catch (error) {
      throw new HttpException(500, "Error fetching messages: " + error.message);
    }
  },

  createMessage: async (messageData) => {
    try {
      let message = await privateMessageService.privateMessageModel.create(
        messageData
      );
      message = await privateMessageService.privateMessageModel.findByPk(
        message.id
      );
      return message;
    } catch (error) {
      throw new HttpException(
        401,
        "Unable to create message: " + error.message
      );
    }
  },

  markAllMessagesAsSeen: async (currentOnlineUserId, id) => {
    try {
      await privateMessageService.privateMessageModel.update(
        { status: "seen" },
        {
          where: {
            receiverId: currentOnlineUserId,
            authorId: id,
          },
        }
      );

      const notifications = await NotificationModel.destroy({
        where: {
          receiverId: currentOnlineUserId,
          authorId: id,
          status: "delivered",
          type: "new_message",
        },
      });

      return;
    } catch (error) {
      throw new HttpException(
        500,
        "Error marking messages as seen: " + error.message
      );
    }
  },
};

module.exports = { privateMessageService };
