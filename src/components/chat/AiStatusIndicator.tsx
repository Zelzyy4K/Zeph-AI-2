import { motion, AnimatePresence } from "framer-motion";
import { AiOrb } from "@/components/ui/AiOrb";
import type { AiStatus } from "@/types/chat";

const LABELS: Record<AiStatus, string> = {
  idle: "",
  thinking: "Thinking...",
  searching: "Searching...",
  reasoning: "Reasoning...",
  planning: "Planning...",
  writing: "Writing...",
  finalizing: "Finalizing...",
};

export function AiStatusIndicator({ status }: { status: AiStatus }) {
  if (status === "idle") return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-2.5 px-1 py-1.5"
      >
        <AiOrb active size={16} />
        <span className="text-[13px] text-white/45">{LABELS[status]}</span>
      </motion.div>
    </AnimatePresence>
  );
}
