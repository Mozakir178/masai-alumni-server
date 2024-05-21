let io = null;
let userSocket = null;

const setSocketServerInstance = (ioInstance) => {
  io = ioInstance;
};
const getSocketServerInstance = () => {
  return { io, socket: userSocket };
};

module.exports = {
  setSocketServerInstance,
  getSocketServerInstance,
};
