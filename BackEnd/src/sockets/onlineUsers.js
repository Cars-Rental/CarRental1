// Map<userId, Set<socketId>> — يدعم نفس اليوزر على أكتر من جهاز/تاب
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
    return true; // fully offline
  }
  return false; // still online from another device
};

export const isOnline = (userId) => onlineUsers.has(userId);

export const getSocketIds = (userId) =>
  Array.from(onlineUsers.get(userId) || []);

export const getAllOnlineUserIds = () => Array.from(onlineUsers.keys());
