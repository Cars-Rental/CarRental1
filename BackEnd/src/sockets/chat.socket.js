import { roomModel } from "../DB/model/room.model.js";
import { messageModel } from "../DB/model/message.model.js";
import { createNotification } from "../services/notification.service.js";
import { NOTIFICATION_TYPES, ENTITY_TYPES } from "../constants/notification.types.js";
import { SOCKET_EVENTS } from "./events/events.js";
import { getSocketIds } from "./onlineUsers.js";

const MEMBER_FIELDS = "userName email avatar bio isOnline lastSeen";

export const registerChatEvents = (io, socket) => {
  const userId = socket.user._id.toString();

  // الانضمام لروم
  socket.on(SOCKET_EVENTS.ROOM_JOIN, async ({ roomId }) => {
    const room = await roomModel.findById(roomId);
    if (!room) return socket.emit(SOCKET_EVENTS.ERROR, { message: "Room not found" });
    if (!room.members.some((m) => m.toString() === userId)) {
      return socket.emit(SOCKET_EVENTS.ERROR, { message: "Not a member of this room" });
    }
    socket.join(roomId);
    socket.emit(SOCKET_EVENTS.ROOM_JOINED, { roomId });
  });

  socket.on(SOCKET_EVENTS.ROOM_LEAVE, ({ roomId }) => socket.leave(roomId));

  // إنشاء private room
  socket.on(SOCKET_EVENTS.ROOM_CREATE_PRIVATE, async ({ targetUserId }) => {
    try {
      if (targetUserId === userId) {
        return socket.emit(SOCKET_EVENTS.ERROR, { message: "Can't chat with yourself" });
      }

      let room = await roomModel.findOne({
        type: "private",
        members: { $all: [userId, targetUserId], $size: 2 },
      });

      if (!room) {
        room = await roomModel.create({ type: "private", members: [userId, targetUserId] });
      }

      room = await room.populate("members", MEMBER_FIELDS);

      socket.join(room._id.toString());
      socket.emit(SOCKET_EVENTS.ROOM_CREATED, { room });

      getSocketIds(targetUserId).forEach((sId) => {
        io.sockets.sockets.get(sId)?.join(room._id.toString());
        io.to(sId).emit(SOCKET_EVENTS.ROOM_CREATED, { room });
      });
    } catch (err) {
      socket.emit(SOCKET_EVENTS.ERROR, { message: err.message });
    }
  });

  // إنشاء جروب
  socket.on(SOCKET_EVENTS.ROOM_CREATE_GROUP, async ({ name, memberIds, avatar }) => {
    try {
      const allMembers = [...new Set([userId, ...memberIds])];

      let room = await roomModel.create({
        type: "group",
        name,
        avatar,
        members: allMembers,
        admin: userId,
      });

      room = await room.populate("members", MEMBER_FIELDS);

      allMembers.forEach((memberId) => {
        getSocketIds(memberId).forEach((sId) => {
          io.sockets.sockets.get(sId)?.join(room._id.toString());
          io.to(sId).emit(SOCKET_EVENTS.ROOM_CREATED, { room, isNew: true });
        });
      });
    } catch (err) {
      socket.emit(SOCKET_EVENTS.ERROR, { message: err.message });
    }
  });

  // إرسال رسالة
  socket.on(SOCKET_EVENTS.MESSAGE_SEND, async ({ roomId, content, attachment }) => {
    try {
      const room = await roomModel
        .findById(roomId)
        .populate("members", "_id userName");

      if (!room || !room.members.some((m) => m._id.toString() === userId)) {
        return socket.emit(SOCKET_EVENTS.ERROR, { message: "Not authorized" });
      }

      const message = await messageModel.create({
        room: roomId,
        sender: userId,
        content,
        attachment,
        readBy: [userId],
      });

      await roomModel.findByIdAndUpdate(roomId, { lastMessage: message._id });

      const populated = await message.populate("sender", MEMBER_FIELDS);

      io.to(roomId).emit(SOCKET_EVENTS.MESSAGE_RECEIVE, {
        ...populated.toObject(),
        totalMembers: room.members.length,
      });

      // إشعار لكل عضو غير المرسل
      const others = room.members.filter((m) => m._id.toString() !== userId);

      await Promise.all(
        others.map((member) =>
          createNotification({
            recipientId: member._id,
            senderId: userId,
            type: NOTIFICATION_TYPES.NEW_MESSAGE,
            title: `رسالة جديدة من ${socket.user.userName}`,
            message: content?.substring(0, 100) || "أرسل مرفق",
            entityType: ENTITY_TYPES.MESSAGE,
            entityId: message._id,
            metadata: {
              roomId,
              roomType: room.type,
              roomName: room.name || null,
            },
          })
        )
      );
    } catch (err) {
      socket.emit(SOCKET_EVENTS.ERROR, { message: err.message });
    }
  });

  // تايبينج
  socket.on(SOCKET_EVENTS.TYPING_START, ({ roomId }) => {
    socket.to(roomId).emit(SOCKET_EVENTS.TYPING_START, {
      userId,
      userName: socket.user.userName,
      roomId,
    });
  });

  socket.on(SOCKET_EVENTS.TYPING_STOP, ({ roomId }) => {
    socket.to(roomId).emit(SOCKET_EVENTS.TYPING_STOP, { userId, roomId });
  });

  // تعليم مقروء
  socket.on(SOCKET_EVENTS.MESSAGE_READ, async ({ roomId }) => {
    await messageModel.updateMany(
      { room: roomId, readBy: { $ne: userId } },
      { $push: { readBy: userId } }
    );
    socket.to(roomId).emit(SOCKET_EVENTS.MESSAGE_READ, { roomId, userId });
  });
};
