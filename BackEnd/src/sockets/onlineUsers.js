

// Map<userId, Set<socketId>>
const onlineUsers = new Map();

export const addUser = (userId, socketId) => {
  if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
  onlineUsers.get(userId).add(socketId);
};

export const removeUser = (userId, socketId) => {
  const sockets = onlineUsers.get(userId);
  if (!sockets) return true;

  sockets.delete(socketId);

  if (sockets.size === 0) {
    onlineUsers.delete(userId);
    return true;
  }

  return false;
};

export const isOnline = (userId) => onlineUsers.has(userId);

export const getSocketIds = (userId) =>
  Array.from(onlineUsers.get(userId) || []);

export const getAllOnlineUserIds = () =>
  Array.from(onlineUsers.keys());


// ✅ الدالة اللي ناقصة
export const handleSocketConnection = (io, socket) => {
  const userId = socket.user.id; // أو socket.user._id حسب الـ JWT عندك

  addUser(userId, socket.id);

  console.log(`${userId} connected`);

  socket.on("disconnect", () => {
    removeUser(userId, socket.id);
    console.log(`${userId} disconnected`);
  });
};
