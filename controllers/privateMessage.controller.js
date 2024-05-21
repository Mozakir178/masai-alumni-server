// const { privateMessageService } = require("@services/privateMessage.service");
// const { NotificationService } = require("@services/notification.service");
// const { ConnectionService } = require("@services/connection.service");
const { UserModel } = require("../models/user.model");
// const { HttpException } = require("@exceptions/HttpException");

const { getSocketServerInstance } = require("../socket/socketStore");
const HttpException = require("../exceptions/HttpException");
const { ConnectionService } = require("../services/connection.service");
const { NotificationService } = require("../services/notification.service");
const { privateMessageService } = require("../services/privateMessage.service");

const privateMessageController = {
  getAllMessages: async (req, res, next) => {
    const currentOnlineUserId = req.user.id;
    const { id } = req.params;
    const { page, pageSize } = req.query;

    try {
      const { messages, user } = await privateMessageService.getAllMessages(
        currentOnlineUserId,
        +id,
        +page || 1,
        +pageSize || 20
      );

      res.status(200).json({
        success: true,
        error: false,
        messages,
        user,
      });
    } catch (error) {
      next(error);
    }
  },

  sendMessage: async (req, res, next) => {
    try {
      const messageData = req.body;
      const chatId = +req.params.id;
      const currentOnlineUserId = req.user.id;
      const { io } = getSocketServerInstance();

      const existingConnection = await ConnectionService.getSingleConnection(
        currentOnlineUserId,
        chatId
      );
      if (!existingConnection) {
        return next(new HttpException(404, "No connection found"));
      }

      const message = await privateMessageService.createMessage({
        ...messageData,
        receiverId: chatId,
        authorId: currentOnlineUserId,
        status: "delivered",
        messageType: "private",
      });

      const receiver = await UserModel.findByPk(chatId);
      if (!receiver) {
        return next(new HttpException(404, "Receiver not found"));
      }

      await ConnectionService.updateLastMessage(
        existingConnection.dataValues.id,
        message.dataValues.id
      );

      if (receiver) {
        const receiverData = receiver.toJSON();

        if (receiverData.socket_id) {
          if (
            receiverData?.current_chat_info?.current_chat_id !== null &&
            receiverData?.current_chat_info?.current_chat_id ===
              currentOnlineUserId
          ) {
            io.to(receiverData.socket_id).emit("message-recieved", {
              success: true,
              error: false,
              message: "Message successfully received",
              messageDetails: message,
            });
          } else {
            const notification = await NotificationService.createNotification({
              receiverId: receiverData.id,
              type: "new_message",
              status: "delivered",
              message: "You received a new message.",
              authorId: currentOnlineUserId,
            });
            io.to(receiverData.socket_id).emit(
              "new-notification",
              notification
            );
          }
        } else {
          await NotificationService.createNotification({
            receiverId: receiverData.id,
            type: "new_message",
            status: "delivered",
            message: "You received a new message.",
            authorId: currentOnlineUserId,
          });
        }
      }

      res.status(201).json({
        success: true,
        error: false,
        message: "Message created successfully",
        messageDetails: message,
      });
    } catch (error) {
      next(error);
    }
  },

  markAllMessagesAsSeen: async (req, res, next) => {
    const currentOnlineUserId = req.user.id;
    const id = +req.params.id;
    const { io } = getSocketServerInstance();
    try {
      await privateMessageService.markAllMessagesAsSeen(
        currentOnlineUserId,
        id
      );
      const receiver = await UserModel.findOne({ where: { id } });
      if (receiver) {
        const receiverData = receiver.toJSON();
        if (receiverData.socket_id) {
          console.log(receiverData);
          io.to(receiverData.socket_id).emit("marked-as-seen", {
            userId: currentOnlineUserId,
          });
        }
      }
      res.status(200).json({
        success: true,
        error: false,
        message: "All messages marked as seen",
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = { privateMessageController };
