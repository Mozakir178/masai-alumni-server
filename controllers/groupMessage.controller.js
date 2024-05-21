const { GroupMessageService } = require("../services/groupMessage.service");
const { getSocketServerInstance } = require("../socket/socketStore");
const { ChapterGroupService } = require("../services/chapter.service");
const GroupMessageController = {
  getAllMessages: async (req, res, next) => {
    const groupId = +req.params.groupId;
    try {
      const messages = await GroupMessageService.getAllMessages(groupId);
      res.status(200).json(messages);
    } catch (error) {
      next(error);
    }
  },

  createMessage: async (req, res, next) => {
    const { io } = getSocketServerInstance();
    try {
      console.log("=============="+req.body)
      const messageData = req.body;
      console.log(messageData);
      const groupId = +req.params.groupId;
      const authorId = +req.user.id;

      const newMessage = await GroupMessageService.createMessage({
        ...messageData,
        authorId,
        messageType: "group",
        groupId,
      });

      ChapterGroupService.updateLastMessage(groupId, newMessage.id);
      io.emit("new_group_message", { messageId: newMessage.id, groupId });
      res.status(201).json(newMessage);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = { GroupMessageController };
