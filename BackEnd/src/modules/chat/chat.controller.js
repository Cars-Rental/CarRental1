import { roomModel } from "../../DB/model/room.model.js";
import { messageModel } from "../../DB/model/message.model.js";
import { userModel } from "../../DB/model/user.model.js";

const MEMBER_FIELDS = "userName email avatar bio isOnline lastSeen";


export const getMyRooms = async (req, res, next) => {
  const userId = req.user?.id || req.user?._id;

  const rooms = await roomModel
    .find({ members: userId })
    .populate("members", MEMBER_FIELDS)
    .populate("admin", MEMBER_FIELDS)
    .populate({
      path: "lastMessage",
      populate: { path: "sender", select: MEMBER_FIELDS },
    })
    .sort({ updatedAt: -1 });

  res.status(200).json({ message: "rooms fetched", rooms });
};


export const getRoomMessages = async (req, res, next) => {
  const { roomId } = req.params;
  const userId = req.user?.id || req.user?._id;

  const room = await roomModel.findById(roomId);

  if (!room) {
    return res.status(404).json({ message: "room not found" });
  }

  if (!room.members.some((m) => m.toString() === userId.toString())) {
    return res.status(403).json({ message: "not authorized for this room" });
  }

  const messages = await messageModel
    .find({ room: roomId, isDeleted: false })
    .populate("sender", MEMBER_FIELDS)
    .sort({ createdAt: 1 });

  res.status(200).json({ message: "messages fetched", messages, totalMembers: room.members.length });
};


export const getAllUsers = async (req, res, next) => {
  const userId = req.user?.id || req.user?._id;

  const users = await userModel
    .find({ _id: { $ne: userId } })
    .select(MEMBER_FIELDS);

  res.status(200).json({ message: "users fetched", users });
};


export const getRoomById = async (req, res, next) => {
  const { roomId } = req.params;
  const userId = req.user?.id || req.user?._id;

  const room = await roomModel
    .findById(roomId)
    .populate("members", MEMBER_FIELDS)
    .populate("admin", MEMBER_FIELDS);

  if (!room) {
    return res.status(404).json({ message: "room not found" });
  }

  if (!room.members.some((m) => m._id.toString() === userId.toString())) {
    return res.status(403).json({ message: "not authorized for this room" });
  }

  res.status(200).json({ message: "room fetched", room });
};
