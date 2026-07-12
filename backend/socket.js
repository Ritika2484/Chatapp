/**
 * socket.js
 *
 * Singleton pattern: `initSocket` stores the io instance once during server
 * startup; `getIO` lets any module (e.g. the controller) retrieve it without
 * importing server.js — eliminating circular dependencies.
 */

let io = null;

const initSocket = (ioInstance) => {
  io = ioInstance;

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialised. Call initSocket first.");
  }
  return io;
};

module.exports = { initSocket, getIO };
