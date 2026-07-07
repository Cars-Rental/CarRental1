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



export const handleSocketConnection = (io, socket) => {
  // derive a stable string id from either `_id` or `id`
  const userId = (socket.user && (socket.user._id || socket.user.id))
    ? (socket.user._id ? socket.user._id.toString() : socket.user.id.toString())
    : null;

  if (!userId) return;

  addUser(userId, socket.id);

  console.log(`${userId} connected`);

  socket.on("disconnect", () => {
    removeUser(userId, socket.id);
    console.log(`${userId} disconnected`);
  });
};
