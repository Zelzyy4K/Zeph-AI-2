import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Check, Search, Bell, PanelLeft, Menu } from "lucide-react";
import { cn } from "@/lib/cn";
import { MODELS } from "@/constants/models";
import { useChatStore } from "@/store/useChatStore";
import { useUiStore } from "@/store/useUiStore";
import { NotificationsPanel } from "./NotificationsPanel";

export function Header() {
  const model = useChatStore((s) => s.model);
  const setModel = useChatStore((s) => s.setModel);
  const sidebarCollapsed = useChatStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useChatStore((s) => s.toggleSidebar);
  const activeConversation = useChatStore((s) => s.activeConversation());
  const setOpenModal = useUiStore((s) => s.setOpenModal);
  const toggleMobileSidebar = useUiStore((s) => s.toggleMobileSidebar);

  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const activeModel = MODELS.find((m) => m.id === model)!;

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="glass sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-white/[0.06] px-3">
      <button
        onClick={toggleMobileSidebar}
        className="focus-ring flex md:hidden h-8 w-8 items-center justify-center rounded-lg text-white/50 hover:bg-white/[0.06] hover:text-white transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu size={18} />
      </button>

      {sidebarCollapsed && (
        <button
          onClick={toggleSidebar}
          className="focus-ring hidden md:flex h-8 w-8 items-center justify-center rounded-lg text-white/50 hover:bg-white/[0.06] hover:text-white transition-colors"
          aria-label="Expand sidebar"
        >
          <PanelLeft size={16} />
        </button>
      )}

      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="focus-ring flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13.5px] font-medium text-white/85 hover:bg-white/[0.06] transition-colors"
        >
          {activeModel.name}
          <ChevronDown size={14} className={cn("text-white/40 transition-transform", open && "rotate-180")} />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -6 }}
              transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
              className="glass-strong absolute left-0 top-full z-20 mt-1.5 w-72 rounded-xl p-1.5 shadow-2xl"
            >
              {MODELS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setModel(m.id);
                    setOpen(false);
                  }}
                  className="focus-ring flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-white/[0.06] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-white/90">{m.name}</p>
                    <p className="text-[11.5px] text-white/40">{m.description}</p>
                  </div>
                  {m.id === model && <Check size={14} className="mt-0.5 text-white/70" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {activeConversation && (
        <>
          <span className="text-white/15">/</span>
          <span className="truncate text-[13px] text-white/45 max-w-[240px]">
            {activeConversation.title}
          </span>
        </>
      )}

      <div className="ml-auto flex items-center gap-1">
        <button
          onClick={() => setOpenModal("search")}
          className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg text-white/50 hover:bg-white/[0.06] hover:text-white transition-colors"
          aria-label="Search"
        >
          <Search size={16} />
        </button>
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen((v) => !v)}
            className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg text-white/50 hover:bg-white/[0.06] hover:text-white transition-colors"
            aria-label="Notifications"
          >
            <Bell size={16} />
          </button>
          {notificationsOpen && (
            <NotificationsPanel onClose={() => setNotificationsOpen(false)} />
          )}
        </div>
        <button
          onClick={() => setOpenModal("settings")}
          className="ml-1 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold hover:bg-white/20 transition-colors"
          aria-label="Account"
        >
          F
        </button>
      </div>
    </header>
  );
}
