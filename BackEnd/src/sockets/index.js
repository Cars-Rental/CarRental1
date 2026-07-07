import { Server } from "socket.io";
import { socketAuthMiddleware } from "./socket.auth.js";
import { registerChatEvents } from "./chat.socket.js";
import { registerNotificationEvents } from "./notification.socket.js";
import { addUser, removeUser, getAllOnlineUserIds } from "./onlineUsers.js";
import { userModel } from "../DB/model/user.model.js";
import { initNotificationService } from "../services/notification.service.js";
import { SOCKET_EVENTS } from "./events/events.js";

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3001",
      credentials: true,
    },
  });

  initNotificationService(io);

  io.use(socketAuthMiddleware);

  io.on(SOCKET_EVENTS.CONNECT, async (socket) => {
    const userId = socket.user._id.toString();

    addUser(userId, socket.id);
    userModel.findByIdAndUpdate(userId, { isOnline: true, socketId: socket.id }).exec();
    socket.broadcast.emit(SOCKET_EVENTS.USER_ONLINE, { userId });

    socket.emit(SOCKET_EVENTS.USERS_ONLINE_LIST, {
      userIds: getAllOnlineUserIds(),
    });

    registerChatEvents(io, socket);
    await registerNotificationEvents(socket);

    socket.on(SOCKET_EVENTS.DISCONNECT, async () => {
      const fullyOffline = removeUser(userId, socket.id);
      if (fullyOffline) {
        await userModel.findByIdAndUpdate(userId, {
          isOnline: false,
          lastSeen: new Date(),
        });
        socket.broadcast.emit(SOCKET_EVENTS.USER_OFFLINE, {
          userId,
          lastSeen: new Date(),
        });
      }
    });
  });

  return io;
};
