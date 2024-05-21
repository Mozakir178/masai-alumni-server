const HttpException = require("../../exceptions/HttpException");
const { UserModel } = require("../../models/user.model");

const handleCurrentChatInfo = async (userId, chatId, chatType, socket) => {
  try {
    const user = await UserModel.findByPk(userId);

    if (!user) {
      throw new HttpException(404, "User not found");
    }

    await UserModel.update(
      { current_chat_info: { current_chat_id: chatId, type: "private" } },
      { where: { id: user.dataValues.id } }
    );
    socket.emit("chat-info-updated", {
      ...user.toJSON(),
      current_chat_info: {
        current_chat_id: chatId,
        type: chatType,
      },
    });
  } catch (error) {
    throw new HttpException(
      500,
      "Error updating current chat info: " + error.message
    );
  }
};

module.exports = handleCurrentChatInfo;
