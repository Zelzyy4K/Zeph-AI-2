import { useState, useMemo } from "react";
import { Pin, Trash2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { Modal } from "@/components/ui/Modal";
import { useLibraryStore } from "@/store/useLibraryStore";
import type { PromptCategory } from "@/types/chat";

const CATEGORIES: (PromptCategory | "All")[] = [
  "All",
  "Programming",
  "Writing",
  "Business",
  "Marketing",
  "Education",
  "Creative",
];

interface PromptLibraryModalProps {
  open: boolean;
  onClose: () => void;
  onUsePrompt: (content: string) => void;
}

export function PromptLibraryModal({ open, onClose, onUsePrompt }: PromptLibraryModalProps) {
  const [category, setCategory] = useState<PromptCategory | "All">("All");
  const prompts = useLibraryStore((s) => s.prompts);
  const togglePinPrompt = useLibraryStore((s) => s.togglePinPrompt);
  const deletePrompt = useLibraryStore((s) => s.deletePrompt);

  const filtered = useMemo(() => {
    const list = category === "All" ? prompts : prompts.filter((p) => p.category === category);
    return [...list].sort((a, b) => Number(b.pinned) - Number(a.pinned));
  }, [prompts, category]);

  function handleUse(content: string) {
    onUsePrompt(content);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Prompt library" width="lg">
      <div className="flex gap-1.5 overflow-x-auto border-b border-white/[0.06] px-4 py-2.5">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn(
              "focus-ring shrink-0 rounded-full px-3 py-1 text-[12px] font-medium transition-colors",
              category === c
                ? "bg-white text-[#0a0a0a]"
                : "bg-white/[0.05] text-white/55 hover:bg-white/[0.09] hover:text-white/85"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-2">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="group flex flex-col gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[13px] font-medium text-white/90">{p.title}</p>
                <p className="text-[11px] text-white/35">{p.category}</p>
              </div>
              <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => togglePinPrompt(p.id)}
                  className={cn(
                    "focus-ring flex h-6 w-6 items-center justify-center rounded-md transition-colors",
                    p.pinned ? "text-white bg-white/10" : "text-white/35 hover:bg-white/[0.08] hover:text-white/80"
                  )}
                  aria-label="Pin prompt"
                >
                  <Pin size={12.5} />
                </button>
                <button
                  onClick={() => deletePrompt(p.id)}
                  className="focus-ring flex h-6 w-6 items-center justify-center rounded-md text-white/35 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                  aria-label="Delete prompt"
                >
                  <Trash2 size={12.5} />
                </button>
              </div>
            </div>
            <p className="line-clamp-2 text-[12px] leading-relaxed text-white/45">{p.content}</p>
            <button
              onClick={() => handleUse(p.content)}
              className="focus-ring mt-1 flex items-center gap-1.5 self-start rounded-lg border border-white/[0.08] px-2.5 py-1 text-[11.5px] font-medium text-white/75 hover:bg-white/[0.06] hover:text-white transition-colors"
            >
              Use prompt
              <ArrowRight size={11} />
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-2 py-8 text-center text-[13px] text-white/30">
            No prompts in this category yet.
          </p>
        )}
      </div>
    </Modal>
  );
}
