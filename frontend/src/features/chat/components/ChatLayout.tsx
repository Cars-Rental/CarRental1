"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { 
  Search, 
  MessageSquare, 
  Send, 
  Paperclip, 
  Smile, 
  CheckCheck, 
  Check,
  User,
  Package,
  Calendar,
  X,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatSocket } from "../hooks/useChatSocket";
import { useAppSelector } from "@/store/hooks";
import type { Room, Message, ChatUser } from "../types";
import { useUserOrders } from "@/features/user-account/hooks/useUserOrders";

interface ChatLayoutProps {
  initialRoomId?: string | null;
  isDashboard?: boolean;
}

export function ChatLayout({ initialRoomId, isDashboard = false }: ChatLayoutProps) {
  const t = useTranslations("Chat");
  const locale = useLocale();
  const { user } = useAppSelector((state) => state.auth);
  
  const {
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
    unreadCounts,
  } = useChatSocket();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "open" | "unread" | "resolved">("all");
  const [inputText, setInputText] = useState("");
  const [resolvedRooms, setResolvedRooms] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch orders to associate booking cards with conversations
  const { data: userOrders } = useUserOrders();

  // Handle initial active room from URL search params
  useEffect(() => {
    if (initialRoomId) {
      selectRoom(initialRoomId);
    } else if (rooms.length > 0 && !activeRoomId) {
      // Default to first room if none selected
      selectRoom(rooms[0]._id);
    }
  }, [initialRoomId, rooms]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  // Find the other member in a private room
  const getParticipant = (room: Room): ChatUser | null => {
    if (!user) return null;
    const other = room.members.find((m) => m._id !== user.id);
    return other || null;
  };

  // Format message timestamp
  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.toLocaleTimeString(locale === "ar" ? "ar-EG" : "en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDateLabel = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
      day: "numeric",
      month: "long",
    });
  };

  // Handle typing input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    
    // Trigger typing:start
    sendTypingStart();

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStop();
    }, 2000);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText.trim());
    setInputText("");
    sendTypingStop();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // Toggle resolved room locally
  const toggleResolved = (roomId: string) => {
    setResolvedRooms((prev) =>
      prev.includes(roomId) ? prev.filter((id) => id !== roomId) : [...prev, roomId]
    );
  };

  // Find booking/order corresponding to the participant
  const getRelatedOrder = (room: Room) => {
    const participant = getParticipant(room);
    if (!participant || !userOrders) return null;
    // Find if there is an order where the customer or owner matches the participant
    return userOrders.find(
      (order) =>
        order.owner._id === participant._id || 
        order.user._id === participant._id
    );
  };

  const relatedOrder = activeRoom ? getRelatedOrder(activeRoom) : null;

  // Filter and search rooms
  const filteredRooms = rooms.filter((room) => {
    const participant = getParticipant(room);
    if (!participant) return false;

    // Search query match
    const nameMatch = participant.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const lastMsgMatch = room.lastMessage?.content?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const matchesSearch = nameMatch || lastMsgMatch;

    if (!matchesSearch) return false;

    // Tab filter match
    const isResolved = resolvedRooms.includes(room._id);
    if (activeTab === "resolved") return isResolved;
    if (activeTab === "open") return !isResolved;
    if (activeTab === "unread") return (unreadCounts[room._id] || 0) > 0;
    
    return true; // "all"
  });

  return (
    <div className={cn(
      "flex bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-sm",
      isDashboard ? "h-[calc(100vh-120px)]" : "h-[70vh] min-h-[500px]"
    )}>
      {/* 1. SIDEBAR - ROOMS LIST */}
      <div className="w-full sm:w-[320px] lg:w-[360px] flex flex-col border-e border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shrink-0">
        {/* Search */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80">
          <div className="relative">
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-2.5 ps-10 pe-4 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            />
            <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex px-3 py-2 gap-1 border-b border-slate-100 dark:border-slate-800/80 overflow-x-auto scrollbar-none shrink-0">
          {(["all", "open", "unread", "resolved"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all",
                activeTab === tab
                  ? "bg-[var(--primary)] text-white"
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800"
              )}
            >
              {t(tab)}
            </button>
          ))}
        </div>

        {/* Rooms Listing */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {isLoadingRooms ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-4 animate-pulse">
                <div className="size-12 rounded-full bg-slate-100 dark:bg-slate-800 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-28 bg-slate-100 dark:bg-slate-800 rounded" />
                  <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded" />
                </div>
              </div>
            ))
          ) : filteredRooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center text-slate-400">
              <MessageSquare className="size-10 mb-2 stroke-[1.5]" />
              <p className="text-xs font-bold">{t("noRooms")}</p>
            </div>
          ) : (
            filteredRooms.map((room) => {
              const participant = getParticipant(room);
              if (!participant) return null;
              
              const isSelected = room._id === activeRoomId;
              const isOnline = onlineUsers.has(participant._id);
              const unreadCount = unreadCounts[room._id] || 0;
              const initials = participant.userName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2);

              return (
                <div
                  key={room._id}
                  onClick={() => selectRoom(room._id)}
                  className={cn(
                    "flex items-center gap-3 p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors relative",
                    isSelected && "bg-slate-50 dark:bg-slate-800/60 border-s-4 border-[var(--primary)]"
                  )}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="size-12 rounded-full bg-[var(--primary)]/10 dark:bg-emerald-400/10 flex items-center justify-center text-[var(--primary)] dark:text-emerald-400 font-extrabold text-sm select-none">
                      {initials}
                    </div>
                    {isOnline && (
                      <span className="absolute bottom-0 end-0 size-3 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900" />
                    )}
                  </div>

                  {/* Name + last message preview */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline gap-2">
                      <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                        {participant.userName}
                      </h3>
                      {room.lastMessage && (
                        <span className="text-[10px] text-slate-400 font-medium">
                          {formatTime(room.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-1">
                      {room.lastMessage?.content || "Sent an attachment"}
                    </p>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-col gap-1.5 items-end">
                    {resolvedRooms.includes(room._id) && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400">
                        {t("resolved")}
                      </span>
                    )}
                    {unreadCount > 0 && (
                      <span className="size-5 rounded-full bg-[var(--primary)] text-white text-[10px] font-bold flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. CHAT VIEWPORT */}
      <div className="flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-950/20 relative">
        {activeRoom ? (
          <>
            {/* Chat Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shrink-0">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {getParticipant(activeRoom)?.userName}
                  </h2>
                  <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                    <span className={cn(
                      "size-2 rounded-full inline-block",
                      onlineUsers.has(getParticipant(activeRoom)?._id || "") ? "bg-emerald-400" : "bg-slate-300 dark:bg-slate-700"
                    )} />
                    {onlineUsers.has(getParticipant(activeRoom)?._id || "") ? t("online") : t("offline")}
                  </p>
                </div>
              </div>

              {/* Resolved button */}
              <button
                onClick={() => toggleResolved(activeRoom._id)}
                className={cn(
                  "text-xs font-bold px-4 py-2 rounded-xl transition-all border",
                  resolvedRooms.includes(activeRoom._id)
                    ? "bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700"
                    : "bg-[var(--primary)]/10 border-[var(--primary)]/20 text-[var(--primary)] hover:bg-[var(--primary)]/20"
                )}
              >
                {t("markAsResolved")}
              </button>
            </div>

            {/* Message Viewport */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {isLoadingMessages ? (
                <div className="h-full flex items-center justify-center text-slate-400">
                  <span className="animate-spin size-6 border-2 border-t-transparent border-[var(--primary)] rounded-full" />
                </div>
              ) : (
                <>
                  {messages.map((message, idx) => {
                    const isMe = message.sender._id === user?.id;
                    const showDate = idx === 0 || formatDateLabel(messages[idx-1].createdAt) !== formatDateLabel(message.createdAt);
                    
                    return (
                      <React.Fragment key={message._id}>
                        {showDate && (
                          <div className="flex justify-center my-3 shrink-0">
                            <span className="text-[10px] font-bold bg-slate-200/50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full">
                              {formatDateLabel(message.createdAt)}
                            </span>
                          </div>
                        )}

                        <div className={cn(
                          "flex gap-3 max-w-[80%]",
                          isMe ? "ms-auto flex-row-reverse" : ""
                        )}>
                          {/* Chat bubble */}
                          <div className="flex flex-col">
                            <div className={cn(
                              "rounded-2xl px-4 py-2.5 text-xs font-medium shadow-sm leading-relaxed",
                              isMe 
                                ? "bg-[var(--primary)] text-white rounded-te-none" 
                                : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/30 dark:border-slate-700/30 rounded-ts-none"
                            )}>
                              {message.content}
                            </div>
                            
                            <span className={cn(
                              "text-[9px] text-slate-400 mt-1 flex items-center gap-1 font-medium",
                              isMe ? "justify-end" : "justify-start"
                            )}>
                              {formatTime(message.createdAt)}
                              {isMe && (
                                message.readBy.length > 1 ? (
                                  <CheckCheck className="size-3 text-emerald-400 shrink-0" />
                                ) : (
                                  <Check className="size-3 text-slate-300 dark:text-slate-600 shrink-0" />
                                )
                              )}
                            </span>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}

                  {/* DYNAMIC RELATED ORDER / BOOKING CARD IN CONVERSATION STREAM */}
                  {relatedOrder && (
                    <div className="flex justify-center my-4">
                      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-4 shadow-sm w-full max-w-sm flex items-center gap-4 hover:scale-[1.01] transition-transform">
                        {relatedOrder.car.carimage?.[0]?.secure_url && (
                          <div className="relative size-16 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                            <Image
                              src={relatedOrder.car.carimage[0].secure_url}
                              alt={relatedOrder.car.carname}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                            {relatedOrder.car.carname}
                          </h4>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                            {t("rentBooking")} #{relatedOrder._id.slice(-6).toUpperCase()}
                          </p>
                          <span className="inline-block mt-2 text-[9px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/20">
                            {t("activeBooking")}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Typing Indicator */}
                  {typingUsers.length > 0 && (
                    <div className="flex gap-2 items-center text-[10px] font-bold text-slate-400 dark:text-slate-500 animate-pulse">
                      <Sparkles className="size-3 text-[var(--primary)] shrink-0" />
                      <span>
                        {typingUsers.map((u) => u.userName).join(", ")} {t("typing")}
                      </span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Actions Footer */}
            <div className="p-4 border-t border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 flex items-center gap-3 shrink-0">
              {/* Attachment */}
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 rounded-xl transition-colors shrink-0">
                <Paperclip className="size-4" />
              </button>

              {/* Emoji */}
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 rounded-xl transition-colors shrink-0">
                <Smile className="size-4" />
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={inputText}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={t("typeMessage")}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-2xl px-4 py-3 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[var(--primary)] focus:bg-white"
              />

              {/* Send */}
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="bg-[var(--primary)] disabled:opacity-40 disabled:pointer-events-none hover:bg-[var(--primary-dark)] text-white p-3 rounded-2xl shadow-sm transition-all shrink-0 hover:scale-105 active:scale-95"
              >
                <Send className="size-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
            <MessageSquare className="size-16 stroke-[1.2] text-slate-300 dark:text-slate-700" />
            <p className="text-sm font-bold">{t("noActiveRoom")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
