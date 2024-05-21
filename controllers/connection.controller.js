const { UserModel } = require("../models/user.model");
const { ConnectionService } = require("../services/connection.service");
const { NotificationService } = require("../services/notification.service");
const { getSocketServerInstance } = require("../socket/socketStore");

const ConnectionController = {
  getAllConnections: async (req, res, next) => {
    const userId = +req.user.id;
    const filters = req.query;
    try {
      const connections = await ConnectionService.getAllConnections(
        userId,
        filters
      );
      res.status(200).json({
        success: true,
        error: false,
        connections,
      });
    } catch (error) {
      next(error);
    }
  },

  sendConnectionRequest: async (req, res, next) => {
    const { user2Id } = req.params;
    const currentOnlineUser = req.user.id;
    const { io } = getSocketServerInstance();
    try {
      const connection = await ConnectionService.sendConnectionRequest(
        Number(currentOnlineUser),
        Number(user2Id)
      );
      const notification = await NotificationService.createNotification({
        receiverId: Number(user2Id),
        type: "connection_request_received",
        status: "delivered",
        message: "You received a connection request.",
        authorId: Number(currentOnlineUser),
      });

      const receiver = (
        await UserModel.findOne({ where: { id: user2Id } })
      ).toJSON();
      if (receiver && receiver.socket_id) {
        io.to(receiver.socket_id).emit(
          "connection-request-recieved",
          connection
        );
        io.to(receiver.socket_id).emit("new-notification", notification);
      }

      res.status(201).json({
        success: true,
        error: false,
        message: "Connection request sent",
        connection,
      });
    } catch (error) {
      next(error);
    }
  },

  acceptConnectionRequest: async (req, res, next) => {
    const user2Id = +req.params.user2Id;
    const currentOnlineUser = req.user.id;
    const { io } = getSocketServerInstance();
    try {
      const connection = await ConnectionService.acceptConnectionRequest(
        user2Id,
        currentOnlineUser
      );

      const notification = await NotificationService.createNotification({
        receiverId: Number(user2Id),
        type: "connection_request_accepted",
        status: "delivered",
        message: "Your connection request was accepted.",
        authorId: Number(currentOnlineUser),
      });

      const receiver = (
        await UserModel.findOne({ where: { id: user2Id } })
      ).toJSON();
      if (receiver && receiver.socket_id) {
        io.to(receiver.socket_id).emit(
          "connection-request-accepted",
          connection
        );
        io.to(receiver.socket_id).emit("new-notification", notification);
      }

      res.status(200).json({
        success: true,
        error: false,
        message: "Connection request accepted",
        connection,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteConnectionRequest: async (req, res, next) => {
    const user2Id = +req.params.user2Id;
    const currentOnlineUser = req.user.id;
    try {
      await ConnectionService.deleteConnectionRequest(
        user2Id,
        currentOnlineUser
      );
      res.status(200).json({
        success: true,
        error: false,
        message: "current connection deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  rejectConnectionRequest: async (req, res, next) => {
    const user2Id = +req.params.user2Id;
    const currentOnlineUser = req.user.id;
    try {
      await ConnectionService.rejectConnectionRequest(
        user2Id,
        currentOnlineUser
      );
      res.status(200).json({
        success: true,
        error: false,
        message: "Connection request rejected",
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = { ConnectionController };
