import type { LucideIcon } from "lucide-react";
import {
  Code2,
  PenLine,
  Languages,
  Bug,
  Lightbulb,
  LayoutTemplate,
  Globe,
  Presentation,
  FileText,
  Database,
  Terminal,
  BadgeCheck,
  FileBadge,
  Briefcase,
} from "lucide-react";

export interface SuggestionCard {
  id: string;
  label: string;
  prompt: string;
  icon: LucideIcon;
}

export const SUGGESTIONS: SuggestionCard[] = [
  { id: "explain-code", label: "Explain code", prompt: "Explain what this code does:\n\n", icon: Code2 },
  { id: "write-article", label: "Write an article", prompt: "Write an article about ", icon: PenLine },
  { id: "translate", label: "Translate", prompt: "Translate the following text to English:\n\n", icon: Languages },
  { id: "fix-bug", label: "Fix a bug", prompt: "Help me fix this bug:\n\n", icon: Bug },
  { id: "brainstorm", label: "Brainstorm ideas", prompt: "Help me brainstorm ideas for ", icon: Lightbulb },
  { id: "generate-ui", label: "Generate a UI", prompt: "Design a UI for ", icon: LayoutTemplate },
  { id: "create-website", label: "Create a website", prompt: "Help me build a website for ", icon: Globe },
  { id: "presentation", label: "Presentation", prompt: "Create an outline for a presentation about ", icon: Presentation },
  { id: "summarize-pdf", label: "Summarize a PDF", prompt: "Summarize the key points of this document:\n\n", icon: FileText },
  { id: "sql-query", label: "SQL query", prompt: "Write a SQL query that ", icon: Database },
  { id: "python-script", label: "Python script", prompt: "Write a Python script that ", icon: Terminal },
  { id: "portfolio", label: "Portfolio", prompt: "Help me plan a portfolio website for ", icon: BadgeCheck },
  { id: "resume", label: "Resume", prompt: "Help me write a resume for ", icon: FileBadge },
  { id: "business-plan", label: "Business plan", prompt: "Help me draft a business plan for ", icon: Briefcase },
];
