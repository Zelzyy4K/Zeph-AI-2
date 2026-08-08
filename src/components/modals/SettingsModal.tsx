import { useState } from "react";
import { cn } from "@/lib/cn";
import { Modal } from "@/components/ui/Modal";
import { useSettingsStore } from "@/store/useSettingsStore";

const TABS = ["General", "Chat", "Appearance", "Account", "About"] as const;
type Tab = (typeof TABS)[number];

export function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("General");

  return (
    <Modal open={open} onClose={onClose} title="Settings" width="lg">
      <div className="flex h-[440px]">
        <div className="w-40 shrink-0 border-r border-white/[0.06] p-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "focus-ring block w-full rounded-lg px-3 py-1.5 text-left text-[13px] transition-colors",
                tab === t
                  ? "bg-white/[0.08] text-white font-medium"
                  : "text-white/50 hover:bg-white/[0.05] hover:text-white/85"
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {tab === "General" && <GeneralTab />}
          {tab === "Chat" && <ChatTab />}
          {tab === "Appearance" && <AppearanceTab />}
          {tab === "Account" && <AccountTab />}
          {tab === "About" && <AboutTab />}
        </div>
      </div>
    </Modal>
  );
}

function Row({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div>
        <p className="text-[13px] font-medium text-white/85">{label}</p>
        {description && <p className="text-[11.5px] text-white/35">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "focus-ring relative h-5 w-9 rounded-full transition-colors",
        checked ? "bg-white" : "bg-white/15"
      )}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={cn(
          "absolute top-0.5 h-4 w-4 rounded-full bg-[#0a0a0a] transition-transform",
          checked ? "translate-x-[18px]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

function Select<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="focus-ring rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1.5 text-[12.5px] text-white/85 outline-none capitalize"
    >
      {options.map((o) => (
        <option key={o} value={o} className="bg-[#181818]">
          {o}
        </option>
      ))}
    </select>
  );
}

function GeneralTab() {
  const { fontSize, language, setSetting } = useSettingsStore();
  return (
    <div className="divide-y divide-white/[0.05]">
      <Row label="Theme" description="Zeph AI currently only supports dark theme">
        <Select value="Dark" options={["Dark"]} onChange={() => {}} />
      </Row>
      <Row label="Language" description="Interface language">
        <Select value={language} options={["en", "id"] as const} onChange={(v) => setSetting("language", v)} />
      </Row>
      <Row label="Font size">
        <Select
          value={fontSize}
          options={["small", "medium", "large"] as const}
          onChange={(v) => setSetting("fontSize", v)}
        />
      </Row>
    </div>
  );
}

function ChatTab() {
  const { streamingEnabled, autoScroll, markdownEnabled, codeHighlightEnabled, setSetting } =
    useSettingsStore();
  return (
    <div className="divide-y divide-white/[0.05]">
      <Row label="Streaming responses" description="Show responses as they're generated">
        <Toggle checked={streamingEnabled} onChange={(v) => setSetting("streamingEnabled", v)} />
      </Row>
      <Row label="Auto scroll" description="Scroll to latest message automatically">
        <Toggle checked={autoScroll} onChange={(v) => setSetting("autoScroll", v)} />
      </Row>
      <Row label="Render markdown">
        <Toggle checked={markdownEnabled} onChange={(v) => setSetting("markdownEnabled", v)} />
      </Row>
      <Row label="Code syntax highlighting">
        <Toggle checked={codeHighlightEnabled} onChange={(v) => setSetting("codeHighlightEnabled", v)} />
      </Row>
    </div>
  );
}

function AppearanceTab() {
  const { bubbleRadius, compactMode, animationSpeed, setSetting } = useSettingsStore();
  return (
    <div className="divide-y divide-white/[0.05]">
      <Row label="Bubble radius">
        <Select
          value={bubbleRadius}
          options={["sm", "md", "lg"] as const}
          onChange={(v) => setSetting("bubbleRadius", v)}
        />
      </Row>
      <Row label="Compact mode" description="Reduce spacing throughout the app">
        <Toggle checked={compactMode} onChange={(v) => setSetting("compactMode", v)} />
      </Row>
      <Row label="Animation speed">
        <Select
          value={animationSpeed}
          options={["slow", "normal", "fast"] as const}
          onChange={(v) => setSetting("animationSpeed", v)}
        />
      </Row>
    </div>
  );
}

function AccountTab() {
  const { username, email, setSetting } = useSettingsStore();
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="mb-1.5 block text-[12px] font-medium text-white/50">Username</label>
        <input
          value={username}
          onChange={(e) => setSetting("username", e.target.value)}
          className="focus-ring w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-[13px] text-white/90 outline-none"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-[12px] font-medium text-white/50">Email</label>
        <input
          value={email}
          onChange={(e) => setSetting("email", e.target.value)}
          className="focus-ring w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-[13px] text-white/90 outline-none"
        />
      </div>
      <Row label="Subscription" description="You're currently on the Free plan">
        <button className="focus-ring rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[12px] font-medium text-white/85 hover:bg-white/[0.08] transition-colors">
          Upgrade
        </button>
      </Row>
    </div>
  );
}

function AboutTab() {
  return (
    <div className="flex flex-col gap-3 text-[13px]">
      <Row label="Version">
        <span className="text-white/50">2026.1.0</span>
      </Row>
      <Row label="Developer">
        <span className="text-white/50">Fadhli</span>
      </Row>
      <Row label="Privacy policy">
        <span className="text-white/30 underline decoration-white/20">View</span>
      </Row>
      <Row label="Terms of service">
        <span className="text-white/30 underline decoration-white/20">View</span>
      </Row>
      <Row label="License">
        <span className="text-white/50">MIT</span>
      </Row>
    </div>
  );
}
