import { create } from "zustand";
import type { ChatMessage, Conversation, ZephModel, AiStatus } from "@/types/chat";

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  model: ZephModel;
  aiStatus: AiStatus;
  sidebarCollapsed: boolean;

  activeConversation: () => Conversation | null;
  createConversation: (firstMessage?: string) => string;
  selectConversation: (id: string) => void;
  addMessage: (conversationId: string, message: ChatMessage) => void;
  updateMessage: (conversationId: string, messageId: string, patch: Partial<ChatMessage>) => void;
  setModel: (model: ZephModel) => void;
  setAiStatus: (status: AiStatus) => void;
  toggleSidebar: () => void;
  togglePin: (id: string) => void;
  toggleFavorite: (id: string) => void;
  toggleArchive: (id: string) => void;
  duplicateConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
}

const genId = () => Math.random().toString(36).slice(2, 10);

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  model: "zeph-pro",
  aiStatus: "idle",
  sidebarCollapsed: false,

  activeConversation: () => {
    const { conversations, activeConversationId } = get();
    return conversations.find((c) => c.id === activeConversationId) ?? null;
  },

  createConversation: (firstMessage) => {
    const id = genId();
    const now = Date.now();
    const conversation: Conversation = {
      id,
      title: firstMessage ? firstMessage.slice(0, 48) : "New chat",
      messages: [],
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({
      conversations: [conversation, ...state.conversations],
      activeConversationId: id,
    }));
    return id;
  },

  selectConversation: (id) => set({ activeConversationId: id }),

  addMessage: (conversationId, message) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? { ...c, messages: [...c.messages, message], updatedAt: Date.now() }
          : c
      ),
    })),

  updateMessage: (conversationId, messageId, patch) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              messages: c.messages.map((m) => (m.id === messageId ? { ...m, ...patch } : m)),
            }
          : c
      ),
    })),

  setModel: (model) => set({ model }),
  setAiStatus: (aiStatus) => set({ aiStatus }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  togglePin: (id) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, pinned: !c.pinned } : c
      ),
    })),

  toggleFavorite: (id) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, favorite: !c.favorite } : c
      ),
    })),

  toggleArchive: (id) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, archived: !c.archived } : c
      ),
    })),

  duplicateConversation: (id) => {
    const conversation = get().conversations.find((c) => c.id === id);
    if (!conversation) return;
    const now = Date.now();
    const copy: Conversation = {
      ...conversation,
      id: genId(),
      title: `${conversation.title} (copy)`,
      createdAt: now,
      updatedAt: now,
      pinned: false,
      messages: conversation.messages.map((m) => ({ ...m, id: genId() })),
    };
    set((state) => ({ conversations: [copy, ...state.conversations] }));
  },

  deleteConversation: (id) =>
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== id),
      activeConversationId:
        state.activeConversationId === id ? null : state.activeConversationId,
    })),

  renameConversation: (id, title) =>
    set((state) => ({
      conversations: state.conversations.map((c) => (c.id === id ? { ...c, title } : c)),
    })),
}));
