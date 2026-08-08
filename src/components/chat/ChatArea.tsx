import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { AiStatusIndicator } from "./AiStatusIndicator";
import type { ChatMessage, AiStatus } from "@/types/chat";

interface ChatAreaProps {
  messages: ChatMessage[];
  aiStatus: AiStatus;
  onEdit: (messageId: string, newContent: string) => void;
  onRetry: (messageId: string) => void;
  onReact: (messageId: string, reaction: "like" | "dislike") => void;
  onBookmark: (messageId: string) => void;
}

export function ChatArea({ messages, aiStatus, onEdit, onRetry, onReact, onBookmark }: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, aiStatus]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onEdit={onEdit}
            onRetry={onRetry}
            onReact={onReact}
            onBookmark={onBookmark}
          />
        ))}
        <AiStatusIndicator status={aiStatus} />
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
