"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Search, MessageSquare, Send, Paperclip, Smile, CheckCheck, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatSocket } from "../hooks/useChatSocket";
import { useAppSelector } from "@/store/hooks";
import type { ChatUser, Room } from "../types";
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
    activeRoom,
    activeRoomId,
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
  const { data: userOrders } = useUserOrders();

  useEffect(() => {
    if (initialRoomId && activeRoomId !== initialRoomId) {
      selectRoom(initialRoomId);
    }
  }, [initialRoomId, activeRoomId, selectRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  const getParticipant = (room: Room): ChatUser | null => {
    if (!user) return null;
    return room.members.find((member) => member._id !== user.id) || null;
  };

  const formatTime = (value: string) => {
    const date = new Date(value);
    return date.toLocaleTimeString(locale === "ar" ? "ar-EG" : "en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (value: string) => {
    const date = new Date(value);
    return date.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
      day: "numeric",
      month: "long",
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
    sendTypingStart();

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStop();
    }, 1500);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText.trim());
    setInputText("");
    sendTypingStop();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  const toggleResolved = (roomId: string) => {
    setResolvedRooms((prev) =>
      prev.includes(roomId) ? prev.filter((id) => id !== roomId) : [...prev, roomId],
    );
  };

  const filteredRooms = rooms.filter((room) => {
    const participant = getParticipant(room);
    if (!participant) return false;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      participant.userName.toLowerCase().includes(query) ||
      (room.lastMessage?.content?.toLowerCase().includes(query) ?? false);

    if (!matchesSearch) return false;

    const isResolved = resolvedRooms.includes(room._id);
    if (activeTab === "resolved") return isResolved;
    if (activeTab === "open") return !isResolved;
    if (activeTab === "unread") return (unreadCounts[room._id] || 0) > 0;
    return true;
  });

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="flex min-h-[70vh] gap-4 overflow-hidden rounded-3xl bg-slate-50 p-0 dark:bg-slate-950">
      <div className="w-full max-w-[360px] flex flex-col border-e border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
        <div className="flex gap-1 overflow-x-auto border-b border-slate-100 dark:border-slate-800/80 p-3">
          {(["all", "open", "unread", "resolved"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "rounded-2xl px-3 py-1.5 text-xs font-bold transition",
                activeTab === tab
                  ? "bg-[var(--primary)] text-white"
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800",
              )}
            >
              {t(tab)}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {isLoadingRooms ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 p-4 animate-pulse">
                <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 rounded bg-slate-100 dark:bg-slate-800" />
                  <div className="h-3 w-full rounded bg-slate-100 dark:bg-slate-800" />
                </div>
              </div>
            ))
          ) : filteredRooms.length === 0 ? (
            <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 p-6 text-slate-400">
              <MessageSquare className="h-10 w-10 stroke-[1.5]" />
              <p className="text-xs font-bold">{t("noRooms")}</p>
            </div>
          ) : (
            filteredRooms.map((room) => {
              const participant = getParticipant(room);
              if (!participant) return null;
              const isSelected = room._id === activeRoomId;
              const initials = participant.userName
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();
              const unread = unreadCounts[room._id] || 0;
              const lastMessage = room.lastMessage?.content || t("noMessagesYet");

              return (
                <button
                  key={room._id}
                  type="button"
                  onClick={() => selectRoom(room._id)}
                  className={cn(
                    "flex w-full items-center gap-3 p-4 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/40",
                    isSelected && "bg-slate-50 dark:bg-slate-800/60 border-s-4 border-[var(--primary)]",
                  )}
                >
                  <div className="relative shrink-0">
                    <div className="h-12 w-12 grid place-items-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)] font-bold dark:bg-emerald-400/10 dark:text-emerald-400">
                      {initials}
                    </div>
                    {onlineUsers.has(participant._id) && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">
                        {participant.userName}
                      </h3>
                      {room.lastMessage?.createdAt && (
                        <span className="text-[10px] text-slate-400">
                          {formatTime(room.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 truncate">
                      {lastMessage}
                    </p>
                  </div>
                  {unread > 0 && (
                    <span className="h-5 w-5 grid place-items-center rounded-full bg-[var(--primary)] text-[10px] font-bold text-white">
                      {unread}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950">
        <div className="h-16 flex items-center justify-between gap-4 border-b border-slate-200/60 bg-white px-6 dark:border-slate-800/60 dark:bg-slate-900">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              {t("conversations")}
            </p>
            <h1 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {activeRoom ? getParticipant(activeRoom)?.userName : t("selectConversation")}
            </h1>
          </div>
          {activeRoom && (
            <button
              type="button"
              onClick={() => toggleResolved(activeRoom._id)}
              className={cn(
                "rounded-2xl px-4 py-2 text-xs font-bold transition border",
                resolvedRooms.includes(activeRoom._id)
                  ? "bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700"
                  : "bg-[var(--primary)]/10 border-[var(--primary)]/20 text-[var(--primary)] hover:bg-[var(--primary)]/20",
              )}
            >
              {t("markAsResolved")}
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeRoom ? (
            <>
              {messages.map((message, index) => {
                const isMe = message.sender._id === user?.id;
                const showDate = index === 0 || formatDate(messages[index - 1].createdAt) !== formatDate(message.createdAt);
                return (
                  <React.Fragment key={message._id}>
                    {showDate && (
                      <div className="flex justify-center my-3 shrink-0">
                        <span className="rounded-full bg-slate-200 px-3 py-1 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                    )}
                    <div className={cn(
                      "flex gap-3 max-w-[80%]",
                      isMe ? "ml-auto flex-row-reverse" : "",
                    )}>
                      <div className="flex flex-col">
                        <div className={cn(
                          "rounded-3xl px-4 py-3 text-xs leading-6",
                          isMe
                            ? "bg-[var(--primary)] text-white rounded-te-none"
                            : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/70 dark:border-slate-700/70 rounded-ts-none",
                        )}>
                          {message.content}
                        </div>
                        <div className={cn(
                          "mt-1 flex items-center gap-2 text-[9px] font-medium",
                          isMe ? "justify-end text-slate-400" : "justify-start text-slate-500 dark:text-slate-400",
                        )}>
                          <span>{formatTime(message.createdAt)}</span>
                          {isMe && (
                            message.readBy.length > 1 ? (
                              <CheckCheck className="h-3 w-3 text-emerald-400" />
                            ) : (
                              <Check className="h-3 w-3 text-slate-300 dark:text-slate-600" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
              {typingUsers.length > 0 && (
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 animate-pulse">
                  <Sparkles className="h-3 w-3 text-[var(--primary)]" />
                  <span>{typingUsers.map((u) => u.userName).join(", ")} {t("typing")}</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <div className="grid min-h-[320px] place-items-center text-center text-slate-500 dark:text-slate-400">
              <MessageSquare className="mb-4 h-16 w-16 text-slate-300 dark:text-slate-700" />
              <div>
                <p className="text-sm font-bold">{t("noActiveRoom")}</p>
                <p className="mt-2 text-xs text-slate-400">{t("selectRoomHint")}</p>
              </div>
            </div>
          )}
        </div>
        <div className="border-t border-slate-200/60 bg-white px-4 py-3 dark:border-slate-800/60 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <button className="rounded-2xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
              <Paperclip className="h-4 w-4" />
            </button>
            <button className="rounded-2xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
              <Smile className="h-4 w-4" />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={t("typeMessage")}
              className="flex-1 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] dark:border-slate-700/70 dark:bg-slate-800 dark:text-slate-100"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="rounded-3xl bg-[var(--primary)] px-4 py-3 text-white transition hover:bg-[var(--primary-dark)] disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}