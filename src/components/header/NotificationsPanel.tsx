import { useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Wrench, Megaphone } from "lucide-react";

const NOTIFICATIONS = [
  { icon: Sparkles, title: "Zeph Vision is here", body: "Upload images and ask Zeph to describe or analyze them.", time: "2h ago" },
  { icon: Wrench, title: "Faster responses", body: "Zeph Lite now responds up to 30% faster.", time: "1d ago" },
  { icon: Megaphone, title: "Welcome to Zeph AI", body: "Explore the prompt library to get started quickly.", time: "3d ago" },
];

export function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.97, y: -6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: -6 }}
        transition={{ duration: 0.14 }}
        className="glass-strong absolute right-0 top-full z-20 mt-1.5 w-80 rounded-xl p-1.5 shadow-2xl"
      >
        <p className="px-2.5 py-1.5 text-[12px] font-medium uppercase tracking-wide text-white/35">
          Notifications
        </p>
        <div className="flex flex-col gap-0.5">
          {NOTIFICATIONS.map((n) => (
            <div
              key={n.title}
              className="flex gap-2.5 rounded-lg px-2.5 py-2 hover:bg-white/[0.05] transition-colors"
            >
              <n.icon size={15} className="mt-0.5 shrink-0 text-white/40" />
              <div className="min-w-0">
                <p className="text-[12.5px] font-medium text-white/85">{n.title}</p>
                <p className="text-[11.5px] leading-relaxed text-white/40">{n.body}</p>
                <p className="mt-0.5 text-[10.5px] text-white/25">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
