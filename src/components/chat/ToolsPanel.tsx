import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Globe, Image as ImageIcon, Code2, Check } from "lucide-react";
import { cn } from "@/lib/cn";

export interface ToolsState {
  webSearch: boolean;
  imageGen: boolean;
  codeInterpreter: boolean;
}

interface ToolsPanelProps {
  tools: ToolsState;
  onToggle: (key: keyof ToolsState) => void;
  onClose: () => void;
}

const OPTIONS: { key: keyof ToolsState; label: string; icon: typeof Globe; description: string }[] = [
  { key: "webSearch", label: "Web search", icon: Globe, description: "Search the web for current info" },
  { key: "imageGen", label: "Image generation", icon: ImageIcon, description: "Generate images from text" },
  { key: "codeInterpreter", label: "Code interpreter", icon: Code2, description: "Run and test code snippets" },
];

export function ToolsPanel({ tools, onToggle, onClose }: ToolsPanelProps) {
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
        initial={{ opacity: 0, scale: 0.97, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 6 }}
        transition={{ duration: 0.14 }}
        className="glass-strong absolute bottom-full left-0 z-20 mb-1.5 w-64 rounded-xl p-1.5 shadow-2xl"
      >
        {OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => onToggle(opt.key)}
            className="focus-ring flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-white/[0.06] transition-colors"
          >
            <opt.icon size={15} className="mt-0.5 shrink-0 text-white/45" />
            <div className="min-w-0 flex-1">
              <p className="text-[12.5px] font-medium text-white/85">{opt.label}</p>
              <p className="text-[11px] text-white/35">{opt.description}</p>
            </div>
            <div
              className={cn(
                "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                tools[opt.key] ? "border-white bg-white" : "border-white/20"
              )}
            >
              {tools[opt.key] && <Check size={11} className="text-[#0a0a0a]" strokeWidth={3} />}
            </div>
          </button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
