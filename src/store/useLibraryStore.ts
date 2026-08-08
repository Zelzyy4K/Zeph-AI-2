import { create } from "zustand";
import type { LibraryPrompt, MemoryItem } from "@/types/chat";

const genId = () => Math.random().toString(36).slice(2, 10);

const DEFAULT_PROMPTS: LibraryPrompt[] = [
  { id: genId(), title: "Explain like I'm five", category: "Education", content: "Explain the following concept like I'm five years old:\n\n" },
  { id: genId(), title: "Code review", category: "Programming", content: "Review this code for bugs, readability, and performance:\n\n" },
  { id: genId(), title: "Refactor function", category: "Programming", content: "Refactor this function to be cleaner and more efficient:\n\n" },
  { id: genId(), title: "Blog post outline", category: "Writing", content: "Write a blog post outline about " },
  { id: genId(), title: "Cold email", category: "Business", content: "Write a short, professional cold outreach email about " },
  { id: genId(), title: "Ad copy variations", category: "Marketing", content: "Write 5 short ad copy variations for " },
  { id: genId(), title: "Story starter", category: "Creative", content: "Write the opening paragraph of a story about " },
  { id: genId(), title: "Study plan", category: "Education", content: "Create a 4-week study plan for learning " },
];

interface LibraryState {
  prompts: LibraryPrompt[];
  memories: MemoryItem[];

  addPrompt: (title: string, category: LibraryPrompt["category"], content: string) => void;
  deletePrompt: (id: string) => void;
  togglePinPrompt: (id: string) => void;

  addMemory: (content: string) => void;
  updateMemory: (id: string, content: string) => void;
  deleteMemory: (id: string) => void;
}

export const useLibraryStore = create<LibraryState>((set) => ({
  prompts: DEFAULT_PROMPTS,
  memories: [
    { id: genId(), content: "Prefers concise, direct answers without filler.", createdAt: Date.now() - 86400000 },
    { id: genId(), content: "Works mainly with React, TypeScript, and Tailwind CSS.", createdAt: Date.now() - 43200000 },
  ],

  addPrompt: (title, category, content) =>
    set((state) => ({
      prompts: [{ id: genId(), title, category, content }, ...state.prompts],
    })),

  deletePrompt: (id) =>
    set((state) => ({ prompts: state.prompts.filter((p) => p.id !== id) })),

  togglePinPrompt: (id) =>
    set((state) => ({
      prompts: state.prompts.map((p) => (p.id === id ? { ...p, pinned: !p.pinned } : p)),
    })),

  addMemory: (content) =>
    set((state) => ({
      memories: [{ id: genId(), content, createdAt: Date.now() }, ...state.memories],
    })),

  updateMemory: (id, content) =>
    set((state) => ({
      memories: state.memories.map((m) => (m.id === id ? { ...m, content } : m)),
    })),

  deleteMemory: (id) =>
    set((state) => ({ memories: state.memories.filter((m) => m.id !== id) })),
}));
