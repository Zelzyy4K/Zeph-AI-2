import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Paperclip, Image as ImageIcon, ArrowUp, Square, Mic, SlidersHorizontal, X, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/cn";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { ToolsPanel, type ToolsState } from "./ToolsPanel";
import type { MessageAttachment } from "@/types/chat";

interface ComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isGenerating: boolean;
  onStop: () => void;
  attachments: MessageAttachment[];
  onAddAttachments: (files: MessageAttachment[]) => void;
  onRemoveAttachment: (id: string) => void;
}

export interface ComposerHandle {
  focus: () => void;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export const Composer = forwardRef<ComposerHandle, ComposerProps>(function Composer(
  {
    value,
    onChange,
    onSend,
    isGenerating,
    onStop,
    attachments,
    onAddAttachments,
    onRemoveAttachment,
  },
  ref
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [toolsOpen, setToolsOpen] = useState(false);
  const [tools, setTools] = useState<ToolsState>({
    webSearch: false,
    imageGen: false,
    codeInterpreter: false,
  });

  const speech = useSpeechRecognition((transcript) => {
    onChange(value ? `${value} ${transcript}` : transcript);
  });

  useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus(),
  }));

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  }, [value]);

  const canSend = value.trim().length > 0 || attachments.length > 0;

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) onSend();
    }
  }

  async function handleFiles(fileList: FileList | null, isImage: boolean) {
    if (!fileList || fileList.length === 0) return;

    const files: MessageAttachment[] = await Promise.all(
      Array.from(fileList).map(async (f) => {
        const isActuallyImage = isImage && f.type.startsWith("image/");
        const base = {
          id: Math.random().toString(36).slice(2, 10),
          name: f.name,
          size: f.size,
          isImage: isActuallyImage,
          previewUrl: isActuallyImage ? URL.createObjectURL(f) : undefined,
        };

        if (!isActuallyImage) return base;

        const base64 = await fileToBase64(f);
        return { ...base, base64, mimeType: f.type };
      })
    );

    onAddAttachments(files);
    toast.success(`${files.length} file${files.length > 1 ? "s" : ""} attached`);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    handleFiles(e.dataTransfer.files, true);
  }

  function toggleTool(key: keyof ToolsState) {
    setTools((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      toast.success(
        `${key === "webSearch" ? "Web search" : key === "imageGen" ? "Image generation" : "Code interpreter"} ${next[key] ? "enabled" : "disabled"}`
      );
      return next;
    });
  }

  function handleVoiceClick() {
    if (!speech.isSupported) {
      toast.error("Voice input isn't supported in this browser.");
      return;
    }
    if (speech.isListening) {
      speech.stop();
    } else {
      speech.start();
    }
  }

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;
  const activeToolCount = Object.values(tools).filter(Boolean).length;

  return (
    <div
      className="mx-auto w-full max-w-3xl px-4 pt-2"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files, false);
          e.target.value = "";
        }}
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files, true);
          e.target.value = "";
        }}
      />

      <div className="glass-strong rounded-2xl p-2 shadow-2xl">
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 px-2 pt-1.5 pb-1">
            {attachments.map((f) => (
              <div
                key={f.id}
                className="group relative flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] py-1 pl-1.5 pr-2"
              >
                {f.isImage && f.previewUrl ? (
                  <img src={f.previewUrl} alt={f.name} className="h-8 w-8 rounded object-cover" />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-white/[0.06]">
                    <FileText size={14} className="text-white/50" />
                  </div>
                )}
                <div className="max-w-[120px]">
                  <p className="truncate text-[11.5px] font-medium text-white/80">{f.name}</p>
                  <p className="text-[10px] text-white/35">{formatSize(f.size)}</p>
                </div>
                <button
                  onClick={() => onRemoveAttachment(f.id)}
                  className="focus-ring flex h-4 w-4 items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-colors"
                  aria-label={`Remove ${f.name}`}
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={speech.isListening ? "Listening..." : "Message Zeph AI..."}
          rows={1}
          className="focus-ring w-full resize-none bg-transparent px-2.5 pt-1.5 text-[14px] leading-relaxed text-white/90 placeholder:text-white/30 outline-none"
        />

        <div className="mt-1 flex items-center gap-1 px-1 pb-0.5">
          <ToolbarButton icon={Paperclip} label="Attach file" onClick={() => fileInputRef.current?.click()} />
          <ToolbarButton icon={ImageIcon} label="Upload image" onClick={() => imageInputRef.current?.click()} />

          <div className="relative">
            <ToolbarButton
              icon={SlidersHorizontal}
              label="Tools"
              onClick={() => setToolsOpen((v) => !v)}
              active={activeToolCount > 0}
              badge={activeToolCount > 0 ? activeToolCount : undefined}
            />
            {toolsOpen && (
              <ToolsPanel tools={tools} onToggle={toggleTool} onClose={() => setToolsOpen(false)} />
            )}
          </div>

          <ToolbarButton
            icon={Mic}
            label={speech.isListening ? "Stop voice input" : "Voice input"}
            onClick={handleVoiceClick}
            active={speech.isListening}
            pulse={speech.isListening}
          />

          <div className="ml-auto flex items-center gap-2.5">
            {charCount > 0 && (
              <span className="hidden text-[11px] text-white/25 sm:inline">
                {wordCount} words · {charCount} chars
              </span>
            )}

            {isGenerating ? (
              <button
                onClick={onStop}
                className="focus-ring flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#0a0a0a] transition-transform hover:scale-105"
                aria-label="Stop generating"
              >
                <Square size={12} fill="currentColor" />
              </button>
            ) : (
              <button
                onClick={() => canSend && onSend()}
                disabled={!canSend}
                className={cn(
                  "focus-ring flex h-8 w-8 items-center justify-center rounded-full transition-all",
                  canSend
                    ? "bg-white text-[#0a0a0a] hover:scale-105"
                    : "bg-white/10 text-white/25"
                )}
                aria-label="Send message"
              >
                <ArrowUp size={16} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
      </div>
      <p className="mt-2 text-center text-[11px] text-white/20">
        Zeph AI can make mistakes. Check important info.
      </p>
    </div>
  );
});

function ToolbarButton({
  icon: Icon,
  label,
  onClick,
  active,
  pulse,
  badge,
}: {
  icon: typeof Paperclip;
  label: string;
  onClick?: () => void;
  active?: boolean;
  pulse?: boolean;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "focus-ring relative flex h-7 w-7 items-center justify-center rounded-lg transition-colors",
        active ? "bg-white/[0.12] text-white" : "text-white/40 hover:bg-white/[0.07] hover:text-white/80"
      )}
      aria-label={label}
    >
      <Icon size={15} className={cn(pulse && "animate-pulse")} />
      {badge !== undefined && (
        <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white text-[9px] font-bold text-[#0a0a0a]">
          {badge}
        </span>
      )}
    </button>
  );
}
