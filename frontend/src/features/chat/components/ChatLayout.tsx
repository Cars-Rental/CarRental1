"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Search, MessageSquare, Send, Paperclip, Smile, CheckCheck, Check, Sparkles, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatSocket } from "../hooks/useChatSocket";
import { useAppSelector } from "@/store/hooks";
import type { ChatUser, Room } from "../types";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { getAllUsersApi } from "../api/chat.api";
import { useRouter } from "next/navigation";

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
    selectRoom,
    sendMessage,
    sendTypingStart,
    sendTypingStop,
    unreadCounts,
    socket,
    createPrivateChat,
  } = useChatSocket();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "open" | "unread" | "resolved">("all");
  const [inputText, setInputText] = useState("");
  const [resolvedRooms, setResolvedRooms] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (initialRoomId && activeRoomId !== initialRoomId) {
      selectRoom(initialRoomId);
    }
  }, [initialRoomId, activeRoomId, selectRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  const getUserId = () => {
    if (!user) return "";
    const idLikeUser = user as { id?: string; _id?: string };
    return idLikeUser.id ?? idLikeUser._id ?? "";
  };

  const getMemberId = (member: ChatUser | string) => {
    if (typeof member === "string") return member;
    const idLikeMember = member as ChatUser & { id?: string };
    return idLikeMember._id ?? idLikeMember.id ?? "";
  };

  const isSamePerson = (member: ChatUser | string) => {
    const memberId = getMemberId(member);
    const userId = getUserId();
    return memberId !== "" && userId !== "" && memberId === userId;
  };

  const getParticipant = (room: Room): ChatUser | null => {
    if (!user) return null;
    return (
      room.members.find((member) => !isSamePerson(member)) as ChatUser | undefined) || null;
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

  // new UI: create chat (private/group)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [usersList, setUsersList] = useState<ChatUser[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const users = await getAllUsersApi();
      setUsersList(users);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const handleToggleUser = (id: string) => {
    setSelectedUserIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleCreate = () => {
    setCreateError(null);
    if (selectedUserIds.length === 0) {
      setCreateError(t("selectAtLeastOne") || "Please select at least one contact to start chat.");
      return;
    }

    if (!socket) {
      setCreateError(t("socketNotConnected") || "Socket is not connected. Please refresh the page.");
      return;
    }

    if (selectedUserIds.length === 1) {
      // private chat
      const targetUserId = selectedUserIds[0];
      const handleError = (error: { message?: string }) => {
        setCreateError(error?.message || t("createRoomFailed") || "Failed to create the room.");
        socket.off("error", handleError);
      };

      socket.once("error", handleError);
      createPrivateChat(targetUserId);
      setIsDialogOpen(false);
      setSelectedUserIds([]);
      return;
    }

    const name = groupName || "Group";

    const handleRoomCreated = ({ room }: { room: Room }) => {
      const redirectPath = isDashboard
        ? `/${locale}/dashboard/messages?roomId=${room._id}`
        : `/${locale}/chat?roomId=${room._id}`;
      router.push(redirectPath);
      socket.off("room:created", handleRoomCreated);
      socket.off("error", handleError);
    };

    const handleError = (error: { message?: string }) => {
      setCreateError(error?.message || t("createRoomFailed") || "Failed to create the room.");
      socket.off("room:created", handleRoomCreated);
      socket.off("error", handleError);
    };

    socket.once("room:created", handleRoomCreated);
    socket.once("error", handleError);
    socket.emit("room:createGroup", { name, memberIds: selectedUserIds });

    setIsDialogOpen(false);
    setSelectedUserIds([]);
    setGroupName("");
  };

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="h-full flex min-h-0 gap-4 overflow-hidden rounded-3xl bg-slate-50 p-0 dark:bg-slate-950">
      <div className="h-full w-full max-w-[360px] flex flex-col border-e border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900">
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
            {/* floating + moved to bottom-right for better UX */}
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
      <div className="flex-1 flex min-h-0 flex-col bg-slate-50 dark:bg-slate-950">
        <div className="h-16 flex items-center justify-between gap-4 border-b border-slate-200/60 bg-white px-6 dark:border-slate-800/60 dark:bg-slate-900">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              {t("conversations")}
            </p>
            <h1 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {activeRoom
                ? activeRoom.type === "group"
                  ? activeRoom.name || t("groupChat")
                  : getParticipant(activeRoom)?.userName || t("selectConversation")
                : t("selectConversation")}
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
        <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4">
          {activeRoom ? (
            <>
              {messages.map((message, index) => {
                const userId = getUserId();
                const senderId =
                  message.sender._id ??
                  (message.sender as ChatUser & { id?: string }).id ??
                  "";
                const isMe = senderId === userId;
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
                      "flex items-end gap-3",
                      isMe ? "justify-end" : "justify-start",
                    )}>
                      <div className={cn(
                        "max-w-[80%] rounded-3xl px-4 py-3 text-xs leading-6 shadow-sm",
                        isMe
                          ? "bg-[var(--primary)] text-white rounded-br-none"
                          : "bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 border border-slate-200/70 dark:border-slate-700/70 rounded-bl-none",
                      )}>
                        {message.content}
                      </div>
                    </div>
                    <div className={cn(
                      "flex items-center gap-2 text-[10px] font-medium",
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
      {/* Floating action button for new chat */}
      <div className="fixed bottom-6 right-6 z-50">
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (open) fetchUsers(); }}>
          <DialogTrigger render={<Button className="rounded-full p-3 bg-[var(--primary)] text-white shadow-lg hover:opacity-90"><Plus className="h-5 w-5" /></Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("newChat") || "New Chat"}</DialogTitle>
              <DialogDescription>{t("selectContacts") || "Select contacts to start chat or create group"}</DialogDescription>
            </DialogHeader>

            <div className="max-h-64 overflow-auto grid gap-2 py-2">
              {usersList.map((u) => {
                const isOnline = onlineUsers.has(u._id) || u.isOnline;
                return (
                  <label
                    key={u._id}
                    className="flex items-center gap-3 px-2 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded"
                  >
                    <Checkbox checked={selectedUserIds.includes(u._id)} onCheckedChange={() => handleToggleUser(u._id)} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{u.userName}</span>
                        <span
                          className={cn(
                            "h-2.5 w-2.5 rounded-full",
                            isOnline ? "bg-emerald-400" : "bg-slate-300",
                          )}
                          aria-hidden="true"
                        />
                      </div>
                      <div className="text-xs text-slate-400 truncate">{u.email}</div>
                    </div>
                  </label>
                );
              })}
            </div>

            {createError && (
              <p className="text-sm text-danger-foreground mt-2">{createError}</p>
            )}

            {selectedUserIds.length > 1 && (
              <div className="mt-2">
                <input value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder={t("groupName") || "Group name"} className="w-full rounded-md border px-3 py-2" />
              </div>
            )}

            <DialogFooter>
              <Button onClick={handleCreate}>{t("create") || "Create"}</Button>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                {t("cancel") || "Cancel"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
