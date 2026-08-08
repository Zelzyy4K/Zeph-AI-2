import { Modal } from "@/components/ui/Modal";

const SHORTCUTS = [
  { keys: "Enter", action: "Send message" },
  { keys: "Shift + Enter", action: "New line" },
  { keys: "Ctrl + Enter", action: "Force send" },
  { keys: "Ctrl + K", action: "Open command palette" },
  { keys: "Esc", action: "Close dialog" },
];

const FAQ = [
  { q: "What is Zeph AI?", a: "Zeph AI is a premium AI chat assistant built for fast, focused conversations." },
  { q: "Which model should I use?", a: "Zeph Lite is fastest for everyday tasks, Zeph Pro handles deeper reasoning, and Zeph Vision understands images." },
  { q: "Is my data private?", a: "Conversations are stored locally in your browser in this preview build." },
];

export function HelpModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Help" width="md">
      <div className="p-4">
        <h3 className="mb-2 text-[12px] font-medium uppercase tracking-wide text-white/35">
          Keyboard shortcuts
        </h3>
        <div className="mb-5 flex flex-col divide-y divide-white/[0.05] rounded-lg border border-white/[0.06]">
          {SHORTCUTS.map((s) => (
            <div key={s.keys} className="flex items-center justify-between px-3 py-2">
              <span className="text-[12.5px] text-white/65">{s.action}</span>
              <kbd className="rounded-md border border-white/[0.1] bg-white/[0.05] px-1.5 py-0.5 text-[11px] text-white/60">
                {s.keys}
              </kbd>
            </div>
          ))}
        </div>

        <h3 className="mb-2 text-[12px] font-medium uppercase tracking-wide text-white/35">
          FAQ
        </h3>
        <div className="flex flex-col gap-3">
          {FAQ.map((f) => (
            <div key={f.q}>
              <p className="text-[13px] font-medium text-white/85">{f.q}</p>
              <p className="text-[12.5px] leading-relaxed text-white/45">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
