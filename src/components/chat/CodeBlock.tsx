import { useState } from "react";
import { Check, Copy, Download, WrapText, Play } from "lucide-react";
import { cn } from "@/lib/cn";
import { useUiStore } from "@/store/useUiStore";

interface CodeBlockProps {
  language: string;
  children: string;
}

const HTML_LANGUAGES = new Set(["html", "htm", "xhtml"]);

export function CodeBlock({ language, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [wrap, setWrap] = useState(false);

  const openCanvas = useUiStore((s) => s.openCanvas);
  const canvasCode = useUiStore((s) => s.canvasCode);
  const isThisBlockRunning = canvasCode === children;

  const isHtml = HTML_LANGUAGES.has(language.toLowerCase());

  function handleCopy() {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleDownload() {
    const blob = new Blob([children], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `snippet.${language || "txt"}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="my-2 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d0d0d]">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium uppercase tracking-wide text-white/35">
            {language}
          </span>
          {isHtml && (
            <button
              onClick={() => openCanvas(children, language)}
              className={cn(
                "focus-ring flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium transition-colors",
                isThisBlockRunning
                  ? "bg-white text-[#0a0a0a]"
                  : "text-white/50 hover:bg-white/[0.08] hover:text-white/85"
              )}
              aria-label="Run HTML"
            >
              <Play size={11} fill="currentColor" />
              Run
            </button>
          )}
        </div>
        <div className="flex items-center gap-0.5">
          <IconButton onClick={() => setWrap((w) => !w)} active={wrap} icon={WrapText} label="Toggle wrap" />
          <IconButton onClick={handleDownload} icon={Download} label="Download" />
          <IconButton
            onClick={handleCopy}
            icon={copied ? Check : Copy}
            label="Copy code"
          />
        </div>
      </div>
      <pre
        className={cn(
          "overflow-x-auto p-3 text-[12.5px] leading-relaxed text-white/85",
          wrap && "whitespace-pre-wrap break-words"
        )}
      >
        <code>{children}</code>
      </pre>
    </div>
  );
}

function IconButton({
  icon: Icon,
  label,
  onClick,
  active,
}: {
  icon: typeof Copy;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "focus-ring flex h-6 w-6 items-center justify-center rounded-md transition-colors",
        active ? "text-white bg-white/[0.1]" : "text-white/40 hover:bg-white/[0.08] hover:text-white/80"
      )}
      aria-label={label}
    >
      <Icon size={12.5} />
    </button>
  );
}
