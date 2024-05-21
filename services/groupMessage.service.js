const  HttpException  = require("../exceptions/HttpException");
const { GroupMessageModel } = require("../models/groupMessage.model");
const { UserModel } = require("../models/user.model");

const GroupMessageService = {
  getAllMessages: async (groupId) => {
    try {
      const messages = await GroupMessageModel.findAll({
        where: { groupId },
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: UserModel,
            as: "messaged_by",
            attributes: ["id", "name", "email", "phone_number", "role"],
          },
         
        ],
      },);
      return messages;
    } catch (error) {
      throw new HttpException(500, "Unable to fetch messages");
    }
  },

  getMessageById: async (messageId) => {
    try {
      const message = await GroupMessageModel.findByPk(messageId,{
        include: [
          {
            model: UserModel,
            as: "messaged_by",
            attributes: ["id", "name", "email", "phone_number", "role"],
          },
         
        ],
      });
      return message;
    } catch (error) {
      throw new HttpException(500, "Unable to fetch message");
    }
  },

  createMessage: async (messageData) => {
    try {
      let message = await GroupMessageModel.create(messageData);
      message = await GroupMessageModel.findByPk(message.id,{
        include: [
          {
            model: UserModel,
            as: "messaged_by",
            attributes: ["id", "name", "email", "phone_number", "role"],
          },
         
        ],
      });
      return message;
    } catch (error) {
      console.log(error.message);
      throw new HttpException(500, "Unable to create message");
    }
  },
};

module.exports = { GroupMessageService };
