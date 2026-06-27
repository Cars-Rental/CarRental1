import { roomModel } from "../DB/model/room.model.js";
import { messageModel } from "../DB/model/message.model.js";
import { userModel } from "../DB/model/user.model.js";

const MEMBER_FIELDS = "userName email avatar bio isOnline lastSeen";


const onlineUsers = new Map();

const addOnline = (userId, socketId) => {
  if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
  onlineUsers.get(userId).add(socketId);
};

const removeOnline = (userId, socketId) => {
  const set = onlineUsers.get(userId);
  if (!set) return true; 
  set.delete(socketId);
  if (set.size === 0) {
    onlineUsers.delete(userId);
    return true; 
  }
  return false; 
};

export const handleSocketConnection = (io, socket) => {
  const userId = socket.user._id.toString();

  
  addOnline(userId, socket.id);
  userModel.findByIdAndUpdate(userId, { isOnline: true, socketId: socket.id }).exec();
  socket.broadcast.emit("user:online", { userId });

 
  socket.emit("users:onlineList", { userIds: Array.from(onlineUsers.keys()) });

  
  socket.on("room:join", async ({ roomId }) => {
    const room = await roomModel.findById(roomId);
    if (!room) return socket.emit("error", { message: "Room not found" });

    if (!room.members.some((m) => m.toString() === userId)) {
      return socket.emit("error", { message: "Not a member of this room" });
    }

    socket.join(roomId);
    socket.emit("room:joined", { roomId });
  });

  socket.on("room:leave", ({ roomId }) => {
    socket.leave(roomId);
  });

  
  socket.on("room:createPrivate", async ({ targetUserId }) => {
    try {
      if (targetUserId === userId) {
        return socket.emit("error", { message: "Can't chat with yourself" });
      }

      let room = await roomModel.findOne({
        type: "private",
        members: { $all: [userId, targetUserId], $size: 2 },
      });

      let isNew = false;

      if (!room) {
        room = await roomModel.create({
          type: "private",
          members: [userId, targetUserId],
        });
        isNew = true;
      }

      room = await room.populate("members", MEMBER_FIELDS);

      socket.join(room._id.toString());
      socket.emit("room:created", { room, isNew });

      const targetSockets = onlineUsers.get(targetUserId);
      if (targetSockets) {
        targetSockets.forEach((sId) => {
          io.sockets.sockets.get(sId)?.join(room._id.toString());
          io.to(sId).emit("room:created", { room, isNew });
        });
      }
    } catch (err) {
      socket.emit("error", { message: err.message });
    }
  });

  
  socket.on("room:createGroup", async ({ name, memberIds, avatar }) => {
    try {
      if (!name || !memberIds || memberIds.length === 0) {
        return socket.emit("error", { message: "Group needs a name and at least one member" });
      }

      const allMembers = [...new Set([userId, ...memberIds])];

      let room = await roomModel.create({
        type: "group",
        name,
        avatar,
        members: allMembers,
        admin: userId,
      });

      room = await room.populate("members", MEMBER_FIELDS);
      room = await room.populate("admin", MEMBER_FIELDS);

      allMembers.forEach((memberId) => {
        const sockets = onlineUsers.get(memberId);
        if (sockets) {
          sockets.forEach((sId) => {
            io.sockets.sockets.get(sId)?.join(room._id.toString());
            io.to(sId).emit("room:created", { room, isNew: true });
          });
        }
      });
    } catch (err) {
      socket.emit("error", { message: err.message });
    }
  });

 
  socket.on("room:addMembers", async ({ roomId, memberIds }) => {
    try {
      const room = await roomModel.findById(roomId);
      if (!room || room.type !== "group") {
        return socket.emit("error", { message: "Group not found" });
      }
      if (room.admin.toString() !== userId) {
        return socket.emit("error", { message: "Only admin can add members" });
      }

      const newMembers = [...new Set([...room.members.map((m) => m.toString()), ...memberIds])];
      room.members = newMembers;
      await room.save();

      const populated = await room.populate("members", MEMBER_FIELDS);

      newMembers.forEach((memberId) => {
        const sockets = onlineUsers.get(memberId);
        if (sockets) {
          sockets.forEach((sId) => {
            io.sockets.sockets.get(sId)?.join(roomId);
            io.to(sId).emit("room:updated", { room: populated });
          });
        }
      });
    } catch (err) {
      socket.emit("error", { message: err.message });
    }
  });

  socket.on("message:send", async ({ roomId, content, attachment }) => {
    try {
      const room = await roomModel.findById(roomId);

      if (!room || !room.members.some((m) => m.toString() === userId)) {
        return socket.emit("error", { message: "Not authorized for this room" });
      }

      const message = await messageModel.create({
        room: roomId,
        sender: userId,
        content,
        attachment,
        readBy: [userId],
      });

      await roomModel.findByIdAndUpdate(roomId, { lastMessage: message._id });

      const populatedMessage = await message.populate("sender", MEMBER_FIELDS);

      io.to(roomId).emit("message:receive", {
        ...populatedMessage.toObject(),
        totalMembers: room.members.length,
      });
    } catch (err) {
      socket.emit("error", { message: err.message });
    }
  });


  socket.on("typing:start", ({ roomId }) => {
    socket.to(roomId).emit("typing:start", { userId, userName: socket.user.userName, roomId });
  });

  socket.on("typing:stop", ({ roomId }) => {
    socket.to(roomId).emit("typing:stop", { userId, roomId });
  });


  socket.on("message:read", async ({ roomId }) => {
    await messageModel.updateMany(
      { room: roomId, readBy: { $ne: userId } },
      { $push: { readBy: userId } }
    );

    socket.to(roomId).emit("message:read", { roomId, userId });
  });

 
  socket.on("disconnect", async () => {
    const fullyOffline = removeOnline(userId, socket.id);

    if (fullyOffline) {
      await userModel.findByIdAndUpdate(userId, {
        isOnline: false,
        lastSeen: new Date(),
      });

      socket.broadcast.emit("user:offline", { userId, lastSeen: new Date() });
    }
  });
};
