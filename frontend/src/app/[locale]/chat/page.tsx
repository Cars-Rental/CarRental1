"use client";

import React from "react";
import { ChatProvider } from "@/features/chat/hooks/useChatSocket";
import { ChatLayout } from "@/features/chat/components/ChatLayout";

export default function ChatPage({ searchParams }: { searchParams?: { roomId?: string } }) {
  // `searchParams` may be a Promise in the App Router. Use React.use() to unwrap.
  // See: https://nextjs.org/docs/messages/sync-dynamic-apis
  // React.use will synchronously return the resolved value.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore-next-line
  const resolvedParams = React.use ? React.use(searchParams) : searchParams;
  const initialRoomId = resolvedParams?.roomId ?? null;

  return (
    <ChatProvider>
      <div className="h-screen overflow-hidden p-6 bg-slate-50 dark:bg-slate-950">
        <ChatLayout initialRoomId={initialRoomId} />
      </div>
    </ChatProvider>
  );
}
