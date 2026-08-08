import { useState, useMemo } from "react";
import { Search, MessageSquare } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useChatStore } from "@/store/useChatStore";
import { useUiStore } from "@/store/useUiStore";

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const conversations = useChatStore((s) => s.conversations);
  const selectConversation = useChatStore((s) => s.selectConversation);

  const results = useMemo(() => {
    if (!query.trim()) return conversations.slice(0, 8);
    const q = query.toLowerCase();
    return conversations.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.messages.some((m) => m.content.toLowerCase().includes(q))
    );
  }, [query, conversations]);

  function handleSelect(id: string) {
    selectConversation(id);
    onClose();
    setQuery("");
  }

  return (
    <Modal open={open} onClose={onClose} title="Search chats" width="md">
      <div className="p-3">
        <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2">
          <Search size={15} className="text-white/35" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or message content..."
            className="focus-ring w-full bg-transparent text-[13.5px] text-white/90 placeholder:text-white/30 outline-none"
          />
        </div>
      </div>

      <div className="px-3 pb-3">
        {results.length === 0 ? (
          <p className="px-2 py-6 text-center text-[13px] text-white/30">
            No conversations found.
          </p>
        ) : (
          <div className="flex flex-col gap-0.5">
            {results.map((c) => (
              <button
                key={c.id}
                onClick={() => handleSelect(c.id)}
                className="focus-ring flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-white/[0.06] transition-colors"
              >
                <MessageSquare size={14} className="shrink-0 text-white/35" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-white/85">{c.title}</p>
                  <p className="truncate text-[11.5px] text-white/35">
                    {c.messages.length} message{c.messages.length === 1 ? "" : "s"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

export function useSearchModal() {
  const openModal = useUiStore((s) => s.openModal);
  const closeModal = useUiStore((s) => s.closeModal);
  return { open: openModal === "search", onClose: closeModal };
}
