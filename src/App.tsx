import { useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Header } from "@/components/header/Header";
import { Landing } from "@/components/landing/Landing";
import { ChatArea } from "@/components/chat/ChatArea";
import { Composer, type ComposerHandle } from "@/components/chat/Composer";
import { SearchModal } from "@/components/modals/SearchModal";
import { PromptLibraryModal } from "@/components/modals/PromptLibraryModal";
import { MemoryModal } from "@/components/modals/MemoryModal";
import { SettingsModal } from "@/components/modals/SettingsModal";
import { HelpModal } from "@/components/modals/HelpModal";
import { FavoritesModal, ArchiveModal } from "@/components/modals/FavoritesArchiveModals";
import { FoldersModal, SharedModal, PluginsModal } from "@/components/modals/EmptyStateModals";
import { CanvasPanel } from "@/components/canvas/CanvasPanel";
import { useChatStore } from "@/store/useChatStore";
import { useUiStore } from "@/store/useUiStore";
import { mockStreamResponse } from "@/services/mockAi";
import { streamChatResponse } from "@/services/groqChat";
import type { ChatMessage, AiStatus, MessageAttachment } from "@/types/chat";

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

function App() {
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const composerRef = useRef<ComposerHandle>(null);
  const abortRef = useRef(false);

  const conversations = useChatStore((s) => s.conversations);
  const activeConversationId = useChatStore((s) => s.activeConversationId);
  const activeConversation = conversations.find((c) => c.id === activeConversationId) ?? null;

  const createConversation = useChatStore((s) => s.createConversation);
  const addMessage = useChatStore((s) => s.addMessage);
  const updateMessage = useChatStore((s) => s.updateMessage);
  const aiStatus = useChatStore((s) => s.aiStatus);
  const setAiStatus = useChatStore((s) => s.setAiStatus);

  const openModal = useUiStore((s) => s.openModal);
  const closeModal = useUiStore((s) => s.closeModal);
  const canvasCode = useUiStore((s) => s.canvasCode);
  const canvasLanguage = useUiStore((s) => s.canvasLanguage);
  const closeCanvas = useUiStore((s) => s.closeCanvas);

  function handlePromptSelect(prompt: string) {
    setInput(prompt);
    composerRef.current?.focus();
  }

  async function runAssistantReply(conversationId: string) {
    const assistantId = genId();
    const assistantMessage: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      createdAt: Date.now(),
      status: "streaming",
    };
    addMessage(conversationId, assistantMessage);

    setIsGenerating(true);
    abortRef.current = false;

    const conversation = useChatStore.getState().conversations.find((c) => c.id === conversationId);
    const history = conversation?.messages.filter((m) => m.id !== assistantId) ?? [];

    let accumulated = "";
    try {
      try {
        for await (const chunk of streamChatResponse({
          messages: history,
          model: useChatStore.getState().model,
          onStatus: (status: AiStatus) => setAiStatus(status),
        })) {
          if (abortRef.current) break;
          accumulated += chunk;
          updateMessage(conversationId, assistantId, { content: accumulated });
        }
      } catch (err) {
        console.warn("Live AI request failed, falling back to mock response:", err);
        accumulated = "";
        for await (const chunk of mockStreamResponse((status: AiStatus) => setAiStatus(status))) {
          if (abortRef.current) break;
          accumulated += chunk;
          updateMessage(conversationId, assistantId, { content: accumulated });
        }
      }
    } finally {
      setAiStatus("idle");
      updateMessage(conversationId, assistantId, { status: "complete" });
      setIsGenerating(false);
    }
  }

  async function handleSend() {
    const text = input.trim();
    if ((!text && attachments.length === 0) || isGenerating) return;

    let conversationId = activeConversationId;
    if (!conversationId) {
      conversationId = createConversation(text || attachments[0]?.name || "New chat");
    }

    const userMessage: ChatMessage = {
      id: genId(),
      role: "user",
      content: text,
      createdAt: Date.now(),
      status: "complete",
      attachments: attachments.length > 0 ? attachments : undefined,
    };
    addMessage(conversationId, userMessage);
    setInput("");
    setAttachments([]);

    await runAssistantReply(conversationId);
  }

  function handleAddAttachments(files: MessageAttachment[]) {
    setAttachments((prev) => [...prev, ...files]);
  }

  function handleRemoveAttachment(id: string) {
    setAttachments((prev) => prev.filter((f) => f.id !== id));
  }

  function handleStop() {
    abortRef.current = true;
    setIsGenerating(false);
    setAiStatus("idle");
  }

  function handleEditMessage(messageId: string, newContent: string) {
    if (!activeConversationId) return;
    updateMessage(activeConversationId, messageId, { content: newContent });
    toast.success("Message updated");
    void runAssistantReply(activeConversationId);
  }

  function handleRetry(messageId: string) {
    if (!activeConversationId || !activeConversation) return;
    const index = activeConversation.messages.findIndex((m) => m.id === messageId);
    if (index === -1) return;
    const keep = activeConversation.messages.slice(0, index);
    useChatStore.setState((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === activeConversationId ? { ...c, messages: keep } : c
      ),
    }));
    void runAssistantReply(activeConversationId);
  }

  function handleReact(messageId: string, reaction: "like" | "dislike") {
    if (!activeConversationId || !activeConversation) return;
    const message = activeConversation.messages.find((m) => m.id === messageId);
    const next = message?.reaction === reaction ? null : reaction;
    updateMessage(activeConversationId, messageId, { reaction: next });
    if (next) toast.success(next === "like" ? "Thanks for the feedback" : "Thanks — noted");
  }

  function handleBookmark(messageId: string) {
    if (!activeConversationId || !activeConversation) return;
    const message = activeConversation.messages.find((m) => m.id === messageId);
    updateMessage(activeConversationId, messageId, { bookmarked: !message?.bookmarked });
    toast.success(message?.bookmarked ? "Bookmark removed" : "Message bookmarked");
  }

  return (
    <div className="relative flex w-screen overflow-hidden" style={{ height: "100dvh" }}>
      <div className="app-backdrop" />

      <div className="relative z-[1] flex h-full w-full">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Header />

          {activeConversation && activeConversation.messages.length > 0 ? (
            <ChatArea
              messages={activeConversation.messages}
              aiStatus={aiStatus}
              onEdit={handleEditMessage}
              onRetry={handleRetry}
              onReact={handleReact}
              onBookmark={handleBookmark}
            />
          ) : (
            <Landing onPromptSelect={handlePromptSelect} />
          )}

          <Composer
            ref={composerRef}
            value={input}
            onChange={setInput}
            onSend={handleSend}
            isGenerating={isGenerating}
            onStop={handleStop}
            attachments={attachments}
            onAddAttachments={handleAddAttachments}
            onRemoveAttachment={handleRemoveAttachment}
          />
        </div>

        <AnimatePresence>
          {canvasCode !== null && canvasLanguage !== null && (
            <CanvasPanel code={canvasCode} language={canvasLanguage} onClose={closeCanvas} />
          )}
        </AnimatePresence>
      </div>

      <SearchModal open={openModal === "search"} onClose={closeModal} />
      <PromptLibraryModal
        open={openModal === "promptLibrary"}
        onClose={closeModal}
        onUsePrompt={handlePromptSelect}
      />
      <MemoryModal open={openModal === "memory"} onClose={closeModal} />
      <SettingsModal open={openModal === "settings"} onClose={closeModal} />
      <HelpModal open={openModal === "help"} onClose={closeModal} />
      <FavoritesModal open={openModal === "favorites"} onClose={closeModal} />
      <ArchiveModal open={openModal === "archive"} onClose={closeModal} />
      <FoldersModal open={openModal === "folders"} onClose={closeModal} />
      <SharedModal open={openModal === "shared"} onClose={closeModal} />
      <PluginsModal open={openModal === "plugins"} onClose={closeModal} />
    </div>
  );
}

export default App;
