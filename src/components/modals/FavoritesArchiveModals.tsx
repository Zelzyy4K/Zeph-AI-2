import { Star, MessageSquare, Archive as ArchiveIcon, RotateCcw } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useChatStore } from "@/store/useChatStore";

export function FavoritesModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const conversations = useChatStore((s) => s.conversations);
  const selectConversation = useChatStore((s) => s.selectConversation);
  const toggleFavorite = useChatStore((s) => s.toggleFavorite);
  const favorites = conversations.filter((c) => c.favorite);

  return (
    <Modal open={open} onClose={onClose} title="Favorites" width="md">
      <div className="p-3">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <Star size={20} className="text-white/20" />
            <p className="text-[13px] text-white/30">No favorite chats yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {favorites.map((c) => (
              <div
                key={c.id}
                className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 hover:bg-white/[0.06] transition-colors"
              >
                <MessageSquare size={14} className="shrink-0 text-white/35" />
                <button
                  onClick={() => {
                    selectConversation(c.id);
                    onClose();
                  }}
                  className="focus-ring min-w-0 flex-1 text-left"
                >
                  <p className="truncate text-[13px] font-medium text-white/85">{c.title}</p>
                </button>
                <button
                  onClick={() => toggleFavorite(c.id)}
                  className="focus-ring flex h-6 w-6 items-center justify-center rounded-md text-white/70 hover:bg-white/[0.1] transition-colors"
                  aria-label="Remove from favorites"
                >
                  <Star size={13} fill="currentColor" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

export function ArchiveModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const conversations = useChatStore((s) => s.conversations);
  const selectConversation = useChatStore((s) => s.selectConversation);
  const toggleArchive = useChatStore((s) => s.toggleArchive);
  const archived = conversations.filter((c) => c.archived);

  return (
    <Modal open={open} onClose={onClose} title="Archive" width="md">
      <div className="p-3">
        {archived.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <ArchiveIcon size={20} className="text-white/20" />
            <p className="text-[13px] text-white/30">No archived chats.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {archived.map((c) => (
              <div
                key={c.id}
                className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 hover:bg-white/[0.06] transition-colors"
              >
                <MessageSquare size={14} className="shrink-0 text-white/35" />
                <button
                  onClick={() => {
                    selectConversation(c.id);
                    onClose();
                  }}
                  className="focus-ring min-w-0 flex-1 text-left"
                >
                  <p className="truncate text-[13px] font-medium text-white/85">{c.title}</p>
                </button>
                <button
                  onClick={() => toggleArchive(c.id)}
                  className="focus-ring flex h-6 w-6 items-center justify-center rounded-md text-white/40 hover:bg-white/[0.1] hover:text-white/80 transition-colors"
                  aria-label="Unarchive"
                >
                  <RotateCcw size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
