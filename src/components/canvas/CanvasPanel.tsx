import { useState } from "react";
import { motion } from "framer-motion";
import { X, RotateCw, ExternalLink, Code2, Eye } from "lucide-react";
import { cn } from "@/lib/cn";

interface CanvasPanelProps {
  code: string;
  language: string;
  onClose: () => void;
}

export function CanvasPanel({ code, language, onClose }: CanvasPanelProps) {
  const [view, setView] = useState<"preview" | "code">("preview");
  const [reloadKey, setReloadKey] = useState(0);

  function handleOpenInNewTab() {
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex flex-col bg-[#0a0a0a]",
        // Desktop: docked side panel with a border. Mobile: full-screen overlay.
        "fixed inset-0 z-40 md:static md:z-auto md:w-[45%] md:min-w-[380px] md:border-l md:border-white/[0.08]"
      )}
      style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-white/[0.08] px-3">
        <span className="text-[13px] font-medium text-white/80">HTML Canvas</span>
        <span className="rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-medium uppercase text-white/40">
          {language}
        </span>

        <div className="ml-auto flex items-center gap-1">
          <div className="mr-1 flex items-center rounded-lg bg-white/[0.05] p-0.5">
            <ViewToggleButton active={view === "preview"} onClick={() => setView("preview")} icon={Eye} label="Preview" />
            <ViewToggleButton active={view === "code"} onClick={() => setView("code")} icon={Code2} label="Code" />
          </div>
          {view === "preview" && (
            <IconButton onClick={() => setReloadKey((k) => k + 1)} icon={RotateCw} label="Reload preview" />
          )}
          <IconButton onClick={handleOpenInNewTab} icon={ExternalLink} label="Open in new tab" />
          <IconButton onClick={onClose} icon={X} label="Close canvas" />
        </div>
      </div>

      <div className="min-h-0 flex-1">
        {view === "preview" ? (
          <iframe
            key={reloadKey}
            title="HTML preview"
            srcDoc={code}
            sandbox="allow-scripts allow-forms allow-modals allow-popups"
            className="h-full w-full border-0 bg-white"
          />
        ) : (
          <pre className="h-full overflow-auto p-4 text-[12.5px] leading-relaxed text-white/85">
            <code>{code}</code>
          </pre>
        )}
      </div>
    </motion.div>
  );
}

function ViewToggleButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Eye;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "focus-ring flex items-center gap-1 rounded-md px-2 py-1 text-[11.5px] font-medium transition-colors",
        active ? "bg-white text-[#0a0a0a]" : "text-white/50 hover:text-white/85"
      )}
      aria-label={label}
    >
      <Icon size={12} />
      {label}
    </button>
  );
}

function IconButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof X;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="focus-ring flex h-7 w-7 items-center justify-center rounded-lg text-white/45 hover:bg-white/[0.08] hover:text-white/85 transition-colors"
      aria-label={label}
    >
      <Icon size={14} />
    </button>
  );
}
