import { create } from "zustand";

export interface SettingsState {
  fontSize: "small" | "medium" | "large";
  language: "en" | "id";
  streamingEnabled: boolean;
  autoScroll: boolean;
  markdownEnabled: boolean;
  codeHighlightEnabled: boolean;
  bubbleRadius: "sm" | "md" | "lg";
  compactMode: boolean;
  animationSpeed: "slow" | "normal" | "fast";
  username: string;
  email: string;

  setSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  fontSize: "medium",
  language: "en",
  streamingEnabled: true,
  autoScroll: true,
  markdownEnabled: true,
  codeHighlightEnabled: true,
  bubbleRadius: "md",
  compactMode: false,
  animationSpeed: "normal",
  username: "Fadhli",
  email: "fadhli@example.com",

  setSetting: (key, value) => set({ [key]: value } as Pick<SettingsState, typeof key>),
}));
