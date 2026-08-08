import { useState } from "react";
import { Plus, Pencil, Trash2, Check, X as XIcon, BrainCircuit } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useLibraryStore } from "@/store/useLibraryStore";

export function MemoryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const memories = useLibraryStore((s) => s.memories);
  const addMemory = useLibraryStore((s) => s.addMemory);
  const updateMemory = useLibraryStore((s) => s.updateMemory);
  const deleteMemory = useLibraryStore((s) => s.deleteMemory);

  const [newMemory, setNewMemory] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  function handleAdd() {
    if (!newMemory.trim()) return;
    addMemory(newMemory.trim());
    setNewMemory("");
  }

  function startEdit(id: string, content: string) {
    setEditingId(id);
    setEditValue(content);
  }

  function saveEdit() {
    if (editingId && editValue.trim()) {
      updateMemory(editingId, editValue.trim());
    }
    setEditingId(null);
  }

  return (
    <Modal open={open} onClose={onClose} title="Memory" width="md">
      <div className="border-b border-white/[0.06] p-4">
        <div className="flex gap-2">
          <input
            value={newMemory}
            onChange={(e) => setNewMemory(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Add something for Zeph to remember..."
            className="focus-ring flex-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-[13px] text-white/90 placeholder:text-white/30 outline-none"
          />
          <button
            onClick={handleAdd}
            disabled={!newMemory.trim()}
            className="focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.08] text-white/80 hover:bg-white/[0.14] disabled:opacity-30 transition-colors"
            aria-label="Add memory"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 p-4">
        {memories.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <BrainCircuit size={22} className="text-white/20" />
            <p className="text-[13px] text-white/30">Zeph doesn't remember anything yet.</p>
          </div>
        ) : (
          memories.map((m) => (
            <div
              key={m.id}
              className="group flex items-start gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5"
            >
              {editingId === m.id ? (
                <>
                  <input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                    className="focus-ring flex-1 rounded-md bg-white/[0.06] px-2 py-1 text-[13px] text-white/90 outline-none"
                  />
                  <button
                    onClick={saveEdit}
                    className="focus-ring flex h-6 w-6 items-center justify-center rounded-md text-white/60 hover:bg-white/[0.1] hover:text-white transition-colors"
                    aria-label="Save"
                  >
                    <Check size={13} />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="focus-ring flex h-6 w-6 items-center justify-center rounded-md text-white/40 hover:bg-white/[0.1] hover:text-white transition-colors"
                    aria-label="Cancel"
                  >
                    <XIcon size={13} />
                  </button>
                </>
              ) : (
                <>
                  <p className="flex-1 text-[13px] leading-relaxed text-white/80">{m.content}</p>
                  <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => startEdit(m.id, m.content)}
                      className="focus-ring flex h-6 w-6 items-center justify-center rounded-md text-white/35 hover:bg-white/[0.08] hover:text-white/80 transition-colors"
                      aria-label="Edit memory"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={() => deleteMemory(m.id)}
                      className="focus-ring flex h-6 w-6 items-center justify-center rounded-md text-white/35 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                      aria-label="Delete memory"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}
