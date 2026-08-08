import type { Conversation } from "@/types/chat";

export function exportConversation(conversation: Conversation, format: "txt" | "md" | "json" = "md") {
  let content: string;
  let mime: string;
  let ext: string;

  if (format === "json") {
    content = JSON.stringify(conversation, null, 2);
    mime = "application/json";
    ext = "json";
  } else if (format === "md") {
    content = conversation.messages
      .map((m) => `**${m.role === "user" ? "You" : "Zeph AI"}:**\n\n${m.content}`)
      .join("\n\n---\n\n");
    mime = "text/markdown";
    ext = "md";
  } else {
    content = conversation.messages
      .map((m) => `${m.role === "user" ? "You" : "Zeph AI"}: ${m.content}`)
      .join("\n\n");
    mime = "text/plain";
    ext = "txt";
  }

  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${conversation.title.slice(0, 40).replace(/[^\w\s-]/g, "")}.${ext}`;
  a.click();
  URL.revokeObjectURL(url);
}
