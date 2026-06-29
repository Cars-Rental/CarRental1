import { ChatProvider } from "@/features/chat/hooks/useChatSocket";
import { ChatLayout } from "@/features/chat/components/ChatLayout";

type MessagesPageProps = {
  searchParams?: Promise<{ roomId?: string }>;
};

export default async function MessagesPage({ searchParams }: MessagesPageProps) {
  const resolvedSearchParams = await searchParams;
  const initialRoomId = resolvedSearchParams?.roomId ?? null;

  return (
    <ChatProvider>
      <div className="h-[calc(100vh-7rem)] min-h-[640px] overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-950">
        <ChatLayout initialRoomId={initialRoomId} isDashboard />
      </div>
    </ChatProvider>
  );
}
