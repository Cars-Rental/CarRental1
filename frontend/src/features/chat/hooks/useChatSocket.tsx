"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAppSelector } from "@/store/hooks";
import { tokenStorage } from "@/features/auth/utils";
import { getRoomsApi, getRoomMessagesApi } from "../api/chat.api";
import type { Room, Message, ChatUser } from "../types";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";

interface ChatContextType {
  socket: Socket | null;
  rooms: Room[];
  messages: Message[];
  activeRoomId: string | null;
  activeRoom: Room | null;
  typingUsers: { userId: string; userName: string }[];
  onlineUsers: Set<string>;
  isLoadingRooms: boolean;
  isLoadingMessages: boolean;
  selectRoom: (roomId: string) => Promise<void>;
  sendMessage: (
    content: string,
    attachment?: { url: string; type: "image" | "file" | "video" },
  ) => void;
  sendTypingStart: () => void;
  sendTypingStop: () => void;
  createPrivateChat: (targetUserId: string) => void;
  markAsRead: (roomId: string) => void;
  unreadCounts: Record<string, number>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const SOCKET_URL = "http://localhost:3000";

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<
    { userId: string; userName: string }[]
  >([]);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const activeRoomIdRef = useRef<string | null>(null);
  activeRoomIdRef.current = activeRoomId;

  // 1. Fetch Rooms Rest API
  const fetchRooms = async () => {
    if (!isAuthenticated) return;
    setIsLoadingRooms(true);
    try {
      const data = await getRoomsApi();
      setRooms(data);
    } catch (err) {
      console.error("Error fetching rooms", err);
    } finally {
      setIsLoadingRooms(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchRooms();
    } else {
      setRooms([]);
      setMessages([]);
      setActiveRoomId(null);
    }
  }, [isAuthenticated]);

  // 2. Manage Socket.io Connection
  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const token = tokenStorage.getAccessToken();
    if (!token) return;

    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    // Real-time events
    newSocket.on("room:created", ({ room }: { room: Room }) => {
      setRooms((prev) => {
        const exists = prev.some((r) => r._id === room._id);
        if (exists) return prev;
        return [room, ...prev];
      });
    });

    newSocket.on(
      "message:receive",
      (message: Message & { totalMembers?: number }) => {
        const currentRoomId = activeRoomIdRef.current;

        // Update room lastMessage in rooms list
        setRooms((prev) => {
          const roomIdx = prev.findIndex((r) => r._id === message.room);
          if (roomIdx === -1) {
            // If room not in list, we could trigger refetch rooms
            fetchRooms();
            return prev;
          }
          const updatedRooms = [...prev];
          updatedRooms[roomIdx] = {
            ...updatedRooms[roomIdx],
            lastMessage: message,
            updatedAt: message.createdAt,
          };
          // Sort rooms by updatedAt
          return updatedRooms.sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          );
        });

        // Handle message streaming to active room viewport
        if (message.room === currentRoomId) {
          setMessages((prev) => {
            const exists = prev.some((m) => m._id === message._id);
            if (exists) return prev;
            return [...prev, message];
          });
          // Emit mark as read
          newSocket.emit("message:read", { roomId: message.room });
        } else {
          // Increment unread count for other rooms
          setUnreadCounts((prev) => ({
            ...prev,
            [message.room]: (prev[message.room] || 0) + 1,
          }));
        }
      },
    );

    newSocket.on(
      "message:read",
      ({ roomId, userId }: { roomId: string; userId: string }) => {
        if (roomId === activeRoomIdRef.current) {
          setMessages((prev) =>
            prev.map((msg) => {
              if (!msg.readBy.includes(userId)) {
                return { ...msg, readBy: [...msg.readBy, userId] };
              }
              return msg;
            }),
          );
        }
      },
    );

    newSocket.on(
      "typing:start",
      ({
        userId,
        userName,
        roomId,
      }: {
        userId: string;
        userName: string;
        roomId: string;
      }) => {
        if (roomId === activeRoomIdRef.current) {
          setTypingUsers((prev) => {
            const exists = prev.some((u) => u.userId === userId);
            if (exists) return prev;
            return [...prev, { userId, userName }];
          });
        }
      },
    );

    newSocket.on(
      "typing:stop",
      ({ userId, roomId }: { userId: string; roomId: string }) => {
        if (roomId === activeRoomIdRef.current) {
          setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
        }
      },
    );

    newSocket.on(
      "users:onlineList",
      ({ onlineUsers: list }: { onlineUsers: string[] }) => {
        setOnlineUsers(new Set(list));
      },
    );

    newSocket.on("user:online", ({ userId }: { userId: string }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.add(userId);
        return next;
      });
    });

    newSocket.on("user:offline", ({ userId }: { userId: string }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [isAuthenticated, user]);

  // 3. Mark active room unread as 0 on activation
  const markAsRead = (roomId: string) => {
    if (socket) {
      socket.emit("message:read", { roomId });
    }
    setUnreadCounts((prev) => ({
      ...prev,
      [roomId]: 0,
    }));
  };

  // 4. Select / Join active room
  const selectRoom = async (roomId: string) => {
    if (!socket) return;
    setIsLoadingMessages(true);
    setActiveRoomId(roomId);
    setTypingUsers([]);
    try {
      socket.emit("room:join", { roomId });
      const msgs = await getRoomMessagesApi(roomId);
      setMessages(msgs);
      markAsRead(roomId);
    } catch (err) {
      console.error("Error getting room messages", err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // 5. Send message
  const sendMessage = (
    content: string,
    attachment?: { url: string; type: "image" | "file" | "video" },
  ) => {
    if (!socket || !activeRoomId) return;
    socket.emit("message:send", {
      roomId: activeRoomId,
      content,
      attachment,
    });
  };

  // 6. Typing notifications
  const sendTypingStart = () => {
    if (!socket || !activeRoomId) return;
    socket.emit("typing:start", { roomId: activeRoomId });
  };

  const sendTypingStop = () => {
    if (!socket || !activeRoomId) return;
    socket.emit("typing:stop", { roomId: activeRoomId });
  };

  // 7. Start Private Chat (from profile, order, or bookings)
  const createPrivateChat = (targetUserId: string) => {
    if (!socket) return;
    socket.emit("room:createPrivate", { targetUserId });

    const handleRoomCreated = ({ room }: { room: Room }) => {
      // Find room in our local list or add it
      setRooms((prev) => {
        const exists = prev.some((r) => r._id === room._id);
        if (exists) return prev;
        return [room, ...prev];
      });

      // Redirect to the appropriate chat page
      const redirectPath =
        user?.role === "trader"
          ? `/${locale}/dashboard/messages?roomId=${room._id}`
          : `/${locale}/chat?roomId=${room._id}`;

      router.push(redirectPath);
      // Clean up listener to prevent duplicate firings
      socket.off("room:created", handleRoomCreated);
    };

    socket.on("room:created", handleRoomCreated);
  };

  const activeRoom = rooms.find((r) => r._id === activeRoomId) || null;

  return (
    <ChatContext.Provider
      value={{
        socket,
        rooms,
        messages,
        activeRoomId,
        activeRoom,
        typingUsers,
        onlineUsers,
        isLoadingRooms,
        isLoadingMessages,
        selectRoom,
        sendMessage,
        sendTypingStart,
        sendTypingStop,
        createPrivateChat,
        markAsRead,
        unreadCounts,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatSocket() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatSocket must be used within a ChatProvider");
  }
  return context;
}
