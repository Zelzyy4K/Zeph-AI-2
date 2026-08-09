export type MessageRole = "user" | "assistant";

export interface MessageAttachment {
  id: string;
  name: string;
  size: number;
  isImage: boolean;
  previewUrl?: string;
  base64?: string;
  mimeType?: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: number;
  status?: "streaming" | "complete" | "error";
  reaction?: "like" | "dislike" | null;
  bookmarked?: boolean;
  attachments?: MessageAttachment[];
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  pinned?: boolean;
  favorite?: boolean;
  archived?: boolean;
}

export type ZephModel = "zeph-lite" | "zeph-pro" | "zeph-vision";

export interface ModelInfo {
  id: ZephModel;
  name: string;
  description: string;
}

export type AiStatus =
  | "idle"
  | "thinking"
  | "searching"
  | "reasoning"
  | "planning"
  | "writing"
  | "finalizing";

export type PromptCategory =
  | "Programming"
  | "Writing"
  | "Business"
  | "Marketing"
  | "Education"
  | "Creative";

export interface LibraryPrompt {
  id: string;
  title: string;
  category: PromptCategory;
  content: string;
  pinned?: boolean;
}

export interface MemoryItem {
  id: string;
  content: string;
  createdAt: number;
}
