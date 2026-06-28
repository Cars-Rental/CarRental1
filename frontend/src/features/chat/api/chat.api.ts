import { axiosInstance } from "@/services";
import type { Room, Message, ChatUser } from "../types";

export interface GetRoomsResponse {
  message: string;
  rooms: Room[];
}

export interface GetRoomByIdResponse {
  message: string;
  room: Room;
}

export interface GetMessagesResponse {
  message: string;
  messages: Message[];
  totalMembers: number;
}

export interface GetUsersResponse {
  message: string;
  users: ChatUser[];
}

export async function getRoomsApi(): Promise<Room[]> {
  const response = await axiosInstance.get<GetRoomsResponse>("/chat/rooms");
  return response.data.rooms;
}

export async function getRoomByIdApi(roomId: string): Promise<Room> {
  const response = await axiosInstance.get<GetRoomByIdResponse>(`/chat/rooms/${roomId}`);
  return response.data.room;
}

export async function getRoomMessagesApi(roomId: string): Promise<Message[]> {
  const response = await axiosInstance.get<GetMessagesResponse>(`/chat/rooms/${roomId}/messages`);
  return response.data.messages;
}

export async function getAllUsersApi(): Promise<ChatUser[]> {
  const response = await axiosInstance.get<GetUsersResponse>("/chat/users");
  return response.data.users;
}
