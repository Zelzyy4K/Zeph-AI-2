import { FolderClosed, Users, Puzzle, Plus } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
}: {
  icon: typeof FolderClosed;
  title: string;
  description: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03]">
        <Icon size={18} className="text-white/40" />
      </div>
      <div>
        <p className="text-[13.5px] font-medium text-white/85">{title}</p>
        <p className="mt-1 max-w-[280px] text-[12.5px] leading-relaxed text-white/40">
          {description}
        </p>
      </div>
      {actionLabel && (
        <button className="focus-ring mt-1 flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[12px] font-medium text-white/80 hover:bg-white/[0.08] transition-colors">
          <Plus size={13} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function FoldersModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Folders" width="sm">
      <EmptyState
        icon={FolderClosed}
        title="No folders yet"
        description="Organize your conversations into folders to keep related chats together."
        actionLabel="Create folder"
      />
    </Modal>
  );
}

export function SharedModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Shared" width="sm">
      <EmptyState
        icon={Users}
        title="Nothing shared yet"
        description="Chats you share with your workspace or teammates will show up here."
      />
    </Modal>
  );
}

export function PluginsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Plugins" width="sm">
      <EmptyState
        icon={Puzzle}
        title="No plugins installed"
        description="Connect tools and integrations to extend what Zeph AI can do."
        actionLabel="Browse plugins"
      />
    </Modal>
  );
}
