import { create } from "zustand";

export type ModalKey =
  | "search"
  | "promptLibrary"
  | "memory"
  | "settings"
  | "help"
  | "favorites"
  | "folders"
  | "shared"
  | "archive"
  | "plugins"
  | null;

interface UiState {
  openModal: ModalKey;
  setOpenModal: (modal: ModalKey) => void;
  closeModal: () => void;

  renamingConversationId: string | null;
  setRenamingConversationId: (id: string | null) => void;

  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;

  canvasCode: string | null;
  canvasLanguage: string | null;
  openCanvas: (code: string, language: string) => void;
  closeCanvas: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  openModal: null,
  setOpenModal: (modal) => set({ openModal: modal }),
  closeModal: () => set({ openModal: null }),

  renamingConversationId: null,
  setRenamingConversationId: (id) => set({ renamingConversationId: id }),

  mobileSidebarOpen: false,
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
  toggleMobileSidebar: () => set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),

  canvasCode: null,
  canvasLanguage: null,
  openCanvas: (code, language) => set({ canvasCode: code, canvasLanguage: language }),
  closeCanvas: () => set({ canvasCode: null, canvasLanguage: null }),
}));
