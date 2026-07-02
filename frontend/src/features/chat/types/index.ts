export interface ChatUser {
  _id: string;
  userName: string;
  email: string;
  avatar?: string;
  bio?: string;
  isOnline?: boolean;
  lastSeen?: string;
}

export interface MessageAttachment {
  url: string;
  type: "image" | "file" | "video";
}

export interface Message {
  _id: string;
  room: string;
  sender: ChatUser;
  content?: string;
  attachment?: MessageAttachment;
  readBy: string[];
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type RoomType = "private" | "group";

export interface Room {
  _id: string;
  name?: string;
  type: RoomType;
  members: ChatUser[];
  admin?: string;
  avatar?: string;
  lastMessage?: Message;
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
}
