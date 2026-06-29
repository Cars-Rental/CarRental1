import { ChatProvider } from "@/features/chat/hooks/useChatSocket";
import { ChatLayout } from "@/features/chat/components/ChatLayout";

type ChatPageProps = {
  searchParams?: Promise<{ roomId?: string }>;
};

export default async function ChatPage({ searchParams }: ChatPageProps) {
  const resolvedSearchParams = await searchParams;
  const initialRoomId = resolvedSearchParams?.roomId ?? null;

  return (
    <ChatProvider>
      <div className="h-screen overflow-hidden bg-slate-50 p-6 dark:bg-slate-950">
        <ChatLayout initialRoomId={initialRoomId} />
      </div>
    </ChatProvider>
  );
}
