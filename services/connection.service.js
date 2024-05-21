const { Op } = require("sequelize");
const HttpException = require("../exceptions/HttpException");
const { ConnectionModel } = require("../models/connection.model");
const { privateMessageModel } = require("../models/privateMessage.model");
const { UserModel } = require("../models/user.model");

const ConnectionService = {
  getAllConnections: async (userId, filters) => {
    let whereClause = {
      [Op.or]: [
        {
          user2Id: userId,
          status: "accepted",
        },
        {
          user2Id: userId,
          status: "pending",
        },
      ],
    };

    if (filters.sentby === "me") {
      if (filters.status === "accepted") {
        whereClause = {
          user1Id: userId,
          status: "accepted",
        };
      } else if (filters.status === "pending") {
        whereClause = {
          user1Id: userId,
          status: "pending",
        };
      }
    } else {
      if (filters.status === "accepted") {
        whereClause = {
          [Op.or]: [
            {
              user1Id: userId,
              status: "accepted",
            },
            {
              user2Id: userId,
              status: "accepted",
            },
          ],
        };
      } else if (filters.status === "pending") {
        whereClause = {
          user2Id: userId,
          status: "pending",
        };
      }
    }

    try {
      const connections = await ConnectionModel.findAll({
        where: whereClause,
        include: [
          {
            as: "User1",
            model: UserModel,
            attributes: {
              exclude: [
                "password",
                "resetToken",
                "resetTokenExpiration",
                "socket_id",
                "current_chat_info",
              ],
            },
          },
          {
            as: "User2",
            model: UserModel,
            attributes: {
              exclude: [
                "password",
                "resetToken",
                "resetTokenExpiration",
                "socket_id",
                "current_chat_info",
              ],
            },
          },
          {
            as: "LastMessageInfo",
            model: privateMessageModel,
          },
        ],
        attributes: { exclude: ["lastMessageId"] },
        order: [["updatedAt", "DESC"]],
      });

      const connectedUsers = connections.map((connection) => {
        const tempConnection = connection.toJSON();
        return userId === tempConnection.user1Id
          ? {
              ...tempConnection.User2,
              status: tempConnection.status,
              lastMessage: tempConnection.LastMessageInfo,
            }
          : {
              ...tempConnection.User1,
              status: tempConnection.status,
              lastMessage: tempConnection.LastMessageInfo,
            };
      });

      const data = await Promise.all(
        connectedUsers.map(async (user) => {
          const unseenMsgCount = await privateMessageModel.count({
            where: {
              receiverId: userId,
              authorId: user.id,
              status: "delivered",
            },
          });
          return { ...user, unseenMsgCount };
        })
      );
      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(500, "Error fetching connections");
      }
    }
  },

  sendConnectionRequest: async (senderId, recieverId) => {
    try {
      if (senderId === recieverId) {
        throw new HttpException(400, "Cannot send connection request to self");
      }

      const userExists = await UserModel.findByPk(recieverId);
      if (!userExists) {
        throw new HttpException(404, "User with user2Id does not exist");
      }

      const existingConnection = await ConnectionModel.findOne({
        where: {
          user1Id: senderId,
          user2Id: recieverId,
        },
      });

      if (existingConnection) {
        throw new HttpException(404, "Connection request already sent");
      }

      let newConnection = await ConnectionModel.create({
        user1Id: senderId,
        user2Id: recieverId,
        status: "pending",
      });
      newConnection = await ConnectionModel.findByPk(newConnection.id);

      return newConnection;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(500, "Unable to send connection request");
      }
    }
  },

  acceptConnectionRequest: async (senderId, user2Id) => {
    try {
      const existingConnection = await ConnectionModel.findOne({
        where: {
          user1Id: senderId,
          user2Id,
          status: "pending",
        },
        include: [
          {
            as: "User1",
            model: UserModel,
            attributes: {
              exclude: [
                "user1Id",
                "user2Id",
                "password",
                "resetToken",
                "resetTokenExpiration",
                "socket_id",
                "current_chat_info",
                "isOnline",
              ],
            },
          },
        ],
      });

      if (!existingConnection) {
        throw new HttpException(404, "No pending connection request found");
      }

      const data = await ConnectionModel.update(
        { status: "accepted" },
        {
          where: { id: existingConnection.toJSON().id, status: "pending" },
          returning: true,
        }
      );

      if (data[0] === 0) {
        throw new Error("Unable to accept connection request");
      }

      return { ...existingConnection.toJSON(), status: "accepted" };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(500, "Unable to accept connection request");
      }
    }
  },

  deleteConnectionRequest: async (currentUserId, deleteUserId) => {
    try {
      const existingConnection = await ConnectionModel.findOne({
        where: {
          status: "accepted",
          [Op.or]: [
            { user1Id: currentUserId, user2Id: deleteUserId },
            { user1Id: deleteUserId, user2Id: currentUserId }
          ],
        },
      });

      if (!existingConnection) {
        throw new HttpException(404, "No accepted connection found between users");
      }

      // Delete the current connection
      const deletedRowsCount = await ConnectionModel.destroy({
        where: { id: existingConnection.toJSON().id },
      });
      if (deletedRowsCount === 0) {
        throw new HttpException(500, "Unable to delete this connection");
      }

      return deletedRowsCount;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(500, "Unable to reject connection request");
      }
    }
  }
  ,
  rejectConnectionRequest: async (senderId, recieverId) => {
    try {
      const existingConnection = await ConnectionModel.findOne({
        where: {
          status: "pending",
          user1Id: senderId,
          user2Id: recieverId,
        },
      });

      if (!existingConnection) {
        throw new HttpException(404, "No pending connection request found");
      }

      // Delete the rejected connection
      const deletedRowsCount = await ConnectionModel.destroy({
        where: { id: existingConnection.toJSON().id },
      });
      if (deletedRowsCount === 0) {
        throw new HttpException(500, "Unable to delete rejected connection");
      }

      return deletedRowsCount;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(500, "Unable to reject connection request");
      }
    }
  },

  updateLastMessage: async (connectionId, messageId) => {
    try {
      const [rowsAffected] = await ConnectionModel.update(
        { lastMessageId: messageId },
        { where: { id: connectionId }, returning: true }
      );

      if (rowsAffected === 0) {
        throw new HttpException(500, "Unable to update last message");
      }
      return rowsAffected;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.log(error);
        throw new HttpException(500, "Internal Server Error");
      }
    }
  },

  getSingleConnection: async (senderId, receiverId) => {
    const connection = await ConnectionModel.findOne({
      where: {
        [Op.or]: [
          {
            user1Id: senderId,
            user2Id: receiverId,
            status: "accepted",
          },
          {
            user1Id: receiverId,
            user2Id: senderId,
            status: "accepted",
          },
        ],
      },
    });

    if (!connection) {
      throw new HttpException(404, "No connection found");
    }
    return connection;
  },
};

module.exports = { ConnectionService };
