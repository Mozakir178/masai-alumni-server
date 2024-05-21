const { Server } = require("socket.io");
const { setSocketServerInstance } = require("./socketStore");
const handleCurrentChatInfo = require("./eventHandlers/handleCurrentChatInfo");
const { UserModel } = require("../models/user.model");

const registerSocketServer = (app, server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  setSocketServerInstance(io);

  io.on("connection", (socket) => {
    socket.on("update-chat-info", async (data) => {
      const { chatId, chatType, userId } = data;
      handleCurrentChatInfo(userId, chatId, chatType, socket);
    });

    socket.on("disconnect", async () => {
      let user = await UserModel.findOne({ where: { socket_id: socket.id } });
      const userId = user?.dataValues?.id;
      user = user?.dataValues;
      if (userId) {
        await UserModel.update(
          {
            socket_id: null,
            isOnline: false,
            current_chat_info: { current_chat_id: null, type: "private" },
          },
          { where: { id: userId } }
        );
        io.emit("userStatusUpdated", {
          ...user,
          socket_id: null,
          isOnline: false,
        });
      }
    });
    socket.on("error", (error) => {
      console.error(`Socket error: ${error}`);
    });
  });
};

module.exports = {
  registerSocketServer,
};
