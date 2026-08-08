import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  PenSquare,
  Search,
  BookMarked,
  Star,
  FolderClosed,
  Users,
  Archive,
  Puzzle,
  BrainCircuit,
  Settings,
  CircleHelp,
  Sparkles,
  ChevronsLeft,
  MoreHorizontal,
  Pin,
  Pencil,
  Copy,
  Download,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/cn";
import { ZephMark } from "@/components/ui/ZephMark";
import { useChatStore } from "@/store/useChatStore";
import { useUiStore, type ModalKey } from "@/store/useUiStore";
import { exportConversation } from "@/utils/exportConversation";
import type { Conversation } from "@/types/chat";

const NAV_ITEMS: { icon: typeof Search; label: string; modal: ModalKey }[] = [
  { icon: Search, label: "Search chat", modal: "search" },
  { icon: BookMarked, label: "Prompt library", modal: "promptLibrary" },
  { icon: Star, label: "Favorites", modal: "favorites" },
  { icon: FolderClosed, label: "Folders", modal: "folders" },
  { icon: Users, label: "Shared", modal: "shared" },
  { icon: Archive, label: "Archive", modal: "archive" },
  { icon: Puzzle, label: "Plugins", modal: "plugins" },
  { icon: BrainCircuit, label: "Memory", modal: "memory" },
];

export function Sidebar() {
  const conversations = useChatStore((s) => s.conversations);
  const activeId = useChatStore((s) => s.activeConversationId);
  const collapsed = useChatStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useChatStore((s) => s.toggleSidebar);
  const selectConversation = useChatStore((s) => s.selectConversation);
  const createConversation = useChatStore((s) => s.createConversation);
  const togglePin = useChatStore((s) => s.togglePin);
  const toggleFavorite = useChatStore((s) => s.toggleFavorite);
  const toggleArchive = useChatStore((s) => s.toggleArchive);
  const duplicateConversation = useChatStore((s) => s.duplicateConversation);
  const deleteConversation = useChatStore((s) => s.deleteConversation);
  const renameConversation = useChatStore((s) => s.renameConversation);

  const setOpenModal = useUiStore((s) => s.setOpenModal);
  const renamingId = useUiStore((s) => s.renamingConversationId);
  const setRenamingId = useUiStore((s) => s.setRenamingConversationId);
  const mobileSidebarOpen = useUiStore((s) => s.mobileSidebarOpen);
  const setMobileSidebarOpen = useUiStore((s) => s.setMobileSidebarOpen);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const visible = conversations.filter((c) => !c.archived);
  const pinned = visible.filter((c) => c.pinned);
  const recent = visible.filter((c) => !c.pinned);

  function handleExport(c: Conversation, format: "txt" | "md" | "json") {
    exportConversation(c, format);
    toast.success(`Exported "${c.title.slice(0, 24)}"`);
    setOpenMenuId(null);
  }

  function handleDuplicate(id: string) {
    duplicateConversation(id);
    toast.success("Chat duplicated");
    setOpenMenuId(null);
  }

  function handleDelete(id: string) {
    deleteConversation(id);
    toast.success("Chat deleted");
    setOpenMenuId(null);
  }

  function handleArchive(id: string) {
    toggleArchive(id);
    toast.success("Chat archived");
    setOpenMenuId(null);
  }

  function handleSelectMobile(id: string) {
    selectConversation(id);
    setMobileSidebarOpen(false);
  }

  function handleNewChatMobile() {
    createConversation();
    setMobileSidebarOpen(false);
  }

  const sharedGroupProps = {
    activeId,
    openMenuId,
    setOpenMenuId,
    renamingId,
    setRenamingId,
    onPin: togglePin,
    onFavorite: toggleFavorite,
    onArchive: handleArchive,
    onDuplicate: handleDuplicate,
    onExport: handleExport,
    onDelete: handleDelete,
    onRename: renameConversation,
  };

  return (
    <>
      {/* ===== Desktop sidebar ===== */}
      {collapsed ? (
        <div className="hidden md:flex w-[64px] shrink-0 flex-col items-center gap-4 border-r border-white/[0.06] bg-[#0a0a0a] py-4">
          <button
            onClick={toggleSidebar}
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors"
            aria-label="Expand sidebar"
          >
            <ZephMark size={18} />
          </button>
          <button
            onClick={() => createConversation()}
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors"
            aria-label="New chat"
          >
            <PenSquare size={17} />
          </button>
        </div>
      ) : (
        <div className="hidden md:flex w-[264px] shrink-0 flex-col border-r border-white/[0.06] bg-[#0a0a0a]">
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <div className="flex items-center gap-2">
              <ZephMark size={18} />
              <span className="text-[14px] font-semibold tracking-tight">Zeph AI</span>
            </div>
            <button
              onClick={toggleSidebar}
              className="focus-ring flex h-7 w-7 items-center justify-center rounded-md text-white/40 hover:bg-white/[0.06] hover:text-white transition-colors"
              aria-label="Collapse sidebar"
            >
              <ChevronsLeft size={15} />
            </button>
          </div>

          <div className="px-3 pt-2">
            <button
              onClick={() => createConversation()}
              className="focus-ring flex w-full items-center gap-2.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-[13px] font-medium text-white/85 hover:bg-white/[0.06] hover:text-white transition-colors"
            >
              <PenSquare size={15} />
              New chat
            </button>
          </div>

          <nav className="px-3 pt-3 flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => setOpenModal(item.modal)}
                className="focus-ring flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] text-white/55 hover:bg-white/[0.05] hover:text-white/90 transition-colors"
              >
                <item.icon size={15} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mx-3 my-3 h-px bg-white/[0.06]" />

          <div className="flex-1 overflow-y-auto px-3 pb-2">
            {pinned.length > 0 && (
              <ConversationGroup label="Pinned" items={pinned} onSelect={selectConversation} {...sharedGroupProps} />
            )}
            <ConversationGroup label="Recent" items={recent} onSelect={selectConversation} {...sharedGroupProps} />
            {visible.length === 0 && (
              <p className="px-2.5 pt-6 text-[12.5px] leading-relaxed text-white/30">
                Your conversations will appear here.
              </p>
            )}
          </div>

          <div className="mx-3 h-px bg-white/[0.06]" />

          <SidebarFooter setOpenModal={setOpenModal} />
        </div>
      )}

      {/* ===== Mobile drawer ===== */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 z-50 flex w-[86%] max-w-[300px] flex-col bg-[#0a0a0a] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] md:hidden"
            >
              <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <div className="flex items-center gap-2">
                  <ZephMark size={18} />
                  <span className="text-[14px] font-semibold tracking-tight">Zeph AI</span>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="focus-ring flex h-7 w-7 items-center justify-center rounded-md text-white/40 hover:bg-white/[0.06] hover:text-white transition-colors"
                  aria-label="Close sidebar"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="px-3 pt-2">
                <button
                  onClick={handleNewChatMobile}
                  className="focus-ring flex w-full items-center gap-2.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-[13px] font-medium text-white/85 hover:bg-white/[0.06] hover:text-white transition-colors"
                >
                  <PenSquare size={15} />
                  New chat
                </button>
              </div>

              <nav className="px-3 pt-3 flex flex-col gap-0.5">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setOpenModal(item.modal);
                      setMobileSidebarOpen(false);
                    }}
                    className="focus-ring flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] text-white/55 hover:bg-white/[0.05] hover:text-white/90 transition-colors"
                  >
                    <item.icon size={15} />
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="mx-3 my-3 h-px bg-white/[0.06]" />

              <div className="flex-1 overflow-y-auto px-3 pb-2">
                {pinned.length > 0 && (
                  <ConversationGroup label="Pinned" items={pinned} onSelect={handleSelectMobile} {...sharedGroupProps} />
                )}
                <ConversationGroup label="Recent" items={recent} onSelect={handleSelectMobile} {...sharedGroupProps} />
                {visible.length === 0 && (
                  <p className="px-2.5 pt-6 text-[12.5px] leading-relaxed text-white/30">
                    Your conversations will appear here.
                  </p>
                )}
              </div>

              <div className="mx-3 h-px bg-white/[0.06]" />

              <SidebarFooter
                setOpenModal={(modal) => {
                  setOpenModal(modal);
                  setMobileSidebarOpen(false);
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarFooter({ setOpenModal }: { setOpenModal: (modal: ModalKey) => void }) {
  return (
    <div className="flex flex-col gap-0.5 px-3 py-3">
      <button
        onClick={() => setOpenModal("settings")}
        className="focus-ring flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] text-white/55 hover:bg-white/[0.05] hover:text-white/90 transition-colors"
      >
        <Settings size={15} />
        Settings
      </button>
      <button
        onClick={() => setOpenModal("help")}
        className="focus-ring flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] text-white/55 hover:bg-white/[0.05] hover:text-white/90 transition-colors"
      >
        <CircleHelp size={15} />
        Help
      </button>
      <button
        onClick={() => toast("Upgrade isn't available in this preview build.")}
        className="focus-ring mt-1 flex items-center gap-2.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-[7px] text-[13px] font-medium text-white/85 hover:bg-white/[0.06] transition-colors"
      >
        <Sparkles size={14} />
        Upgrade to Pro
      </button>

      <div className="mt-3 flex items-center gap-2.5 px-1">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold">
          F
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate text-[12.5px] font-medium text-white/85">Fadhli</p>
          <p className="truncate text-[11px] text-white/35">Free plan · 2.1 GB used</p>
        </div>
      </div>
    </div>
  );
}

interface ConversationGroupProps {
  label: string;
  items: Conversation[];
  activeId: string | null;
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
  renamingId: string | null;
  setRenamingId: (id: string | null) => void;
  onSelect: (id: string) => void;
  onPin: (id: string) => void;
  onFavorite: (id: string) => void;
  onArchive: (id: string) => void;
  onDuplicate: (id: string) => void;
  onExport: (c: Conversation, format: "txt" | "md" | "json") => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
}

function ConversationGroup({
  label,
  items,
  activeId,
  openMenuId,
  setOpenMenuId,
  renamingId,
  setRenamingId,
  onSelect,
  onPin,
  onFavorite,
  onArchive,
  onDuplicate,
  onExport,
  onDelete,
  onRename,
}: ConversationGroupProps) {
  const [draftTitle, setDraftTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renamingId) inputRef.current?.focus();
  }, [renamingId]);

  if (items.length === 0) return null;

  function startRename(c: Conversation) {
    setDraftTitle(c.title);
    setRenamingId(c.id);
    setOpenMenuId(null);
  }

  function commitRename(id: string) {
    if (draftTitle.trim()) onRename(id, draftTitle.trim());
    setRenamingId(null);
  }

  return (
    <div className="pt-3 first:pt-2">
      <p className="px-2.5 pb-1.5 text-[11px] font-medium uppercase tracking-wide text-white/25">
        {label}
      </p>
      <div className="flex flex-col gap-0.5">
        {items.map((c) => (
          <div key={c.id} className="group relative">
            {renamingId === c.id ? (
              <input
                ref={inputRef}
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitRename(c.id);
                  if (e.key === "Escape") setRenamingId(null);
                }}
                onBlur={() => commitRename(c.id)}
                className="focus-ring w-full rounded-lg border border-white/20 bg-white/[0.08] px-2.5 py-[6px] text-[13px] text-white outline-none"
              />
            ) : (
              <>
                <button
                  onClick={() => onSelect(c.id)}
                  className={cn(
                    "focus-ring flex w-full items-center rounded-lg px-2.5 py-[7px] text-left text-[13px] transition-colors",
                    activeId === c.id
                      ? "bg-white/[0.08] text-white"
                      : "text-white/55 hover:bg-white/[0.05] hover:text-white/90"
                  )}
                >
                  <span className="truncate pr-6">{c.title}</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === c.id ? null : c.id);
                  }}
                  className={cn(
                    "focus-ring absolute right-1.5 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-md text-white/40 hover:bg-white/[0.1] hover:text-white transition-opacity",
                    openMenuId === c.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )}
                  aria-label="Chat options"
                >
                  <MoreHorizontal size={14} />
                </button>
              </>
            )}

            <AnimatePresence>
              {openMenuId === c.id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -4 }}
                  transition={{ duration: 0.12 }}
                  className="glass-strong absolute right-0 top-full z-20 mt-1 w-44 rounded-lg p-1 shadow-2xl"
                >
                  <MenuItem icon={Pencil} label="Rename" onClick={() => startRename(c)} />
                  <MenuItem icon={Copy} label="Duplicate" onClick={() => onDuplicate(c.id)} />
                  <MenuItem
                    icon={Star}
                    label={c.favorite ? "Unfavorite" : "Favorite"}
                    onClick={() => onFavorite(c.id)}
                  />
                  <MenuItem
                    icon={Pin}
                    label={c.pinned ? "Unpin" : "Pin"}
                    onClick={() => onPin(c.id)}
                  />
                  <MenuItem icon={Archive} label="Archive" onClick={() => onArchive(c.id)} />
                  <MenuItem
                    icon={Download}
                    label="Export as Markdown"
                    onClick={() => onExport(c, "md")}
                  />
                  <MenuItem
                    icon={Download}
                    label="Export as JSON"
                    onClick={() => onExport(c, "json")}
                  />
                  <div className="my-1 h-px bg-white/10" />
                  <MenuItem icon={Trash2} label="Delete" danger onClick={() => onDelete(c.id)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  danger,
  onClick,
}: {
  icon: typeof Pencil;
  label: string;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "focus-ring flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[12.5px] transition-colors",
        danger
          ? "text-red-400/80 hover:bg-red-500/10 hover:text-red-400"
          : "text-white/70 hover:bg-white/[0.08] hover:text-white"
      )}
    >
      <Icon size={13} />
      {label}
    </button>
  );
}
