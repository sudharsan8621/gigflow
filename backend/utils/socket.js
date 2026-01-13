const socketIO = require('socket.io');

let io;
const userSockets = new Map();

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join', (userId) => {
      if (userId) {
        userSockets.set(userId, socket.id);
        socket.join(userId);
        console.log(`User ${userId} joined`);
      }
    });

    socket.on('disconnect', () => {
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};

const sendNotification = (userId, event, data) => {
  if (io) {
    io.to(userId.toString()).emit(event, data);
    console.log(`Notification sent to ${userId}: ${event}`);
  }
};

module.exports = { initializeSocket, getIO, sendNotification };