import { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import toast from "react-hot-toast";
import {
  Copy,
  Check,
  Pencil,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Share2,
  FileText,
  X as XIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { ZephMark } from "@/components/ui/ZephMark";
import type { ChatMessage } from "@/types/chat";
import { CodeBlock } from "./CodeBlock";

interface MessageBubbleProps {
  message: ChatMessage;
  onEdit: (messageId: string, newContent: string) => void;
  onRetry: (messageId: string) => void;
  onReact: (messageId: string, reaction: "like" | "dislike") => void;
  onBookmark: (messageId: string) => void;
}

export function MessageBubble({ message, onEdit, onRetry, onReact, onBookmark }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(message.content);

  function handleCopy() {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ text: message.content }).catch(() => {});
    } else {
      navigator.clipboard.writeText(message.content);
      toast.success("Link copied — sharing isn't supported in this browser");
    }
  }

  function saveEdit() {
    if (draft.trim() && draft !== message.content) {
      onEdit(message.id, draft.trim());
    }
    setIsEditing(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn("group flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {!isUser && (
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03]">
          <ZephMark size={13} />
        </div>
      )}

      <div className={cn("flex max-w-[78%] flex-col gap-1.5", isUser && "items-end")}>
        {isEditing ? (
          <div className="w-full min-w-[280px] rounded-2xl border border-white/20 bg-white/[0.06] p-2">
            <textarea
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={Math.min(8, draft.split("\n").length + 1)}
              className="focus-ring w-full resize-none bg-transparent px-1.5 py-1 text-[14px] leading-relaxed text-white/90 outline-none"
            />
            <div className="flex justify-end gap-1.5 px-1 pt-1">
              <button
                onClick={() => {
                  setDraft(message.content);
                  setIsEditing(false);
                }}
                className="focus-ring flex items-center gap-1 rounded-lg px-2.5 py-1 text-[12px] text-white/50 hover:bg-white/[0.08] hover:text-white/85 transition-colors"
              >
                <XIcon size={12} />
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="focus-ring flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-[12px] font-medium text-[#0a0a0a] hover:bg-white/90 transition-colors"
              >
                <Check size={12} />
                Save & submit
              </button>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed",
              isUser
                ? "bg-white text-[#0a0a0a]"
                : "border border-white/[0.06] bg-white/[0.03] text-white/90"
            )}
          >
            {isUser ? (
              <>
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-2">
                    {message.attachments.map((a) =>
                      a.isImage && a.previewUrl ? (
                        <img
                          key={a.id}
                          src={a.previewUrl}
                          alt={a.name}
                          className="h-24 w-24 rounded-lg object-cover"
                        />
                      ) : (
                        <div
                          key={a.id}
                          className="flex items-center gap-2 rounded-lg bg-black/[0.06] px-2.5 py-1.5"
                        >
                          <FileText size={14} />
                          <span className="max-w-[140px] truncate text-[12px] font-medium">
                            {a.name}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}
                {message.content && <p className="whitespace-pre-wrap">{message.content}</p>}
              </>
            ) : (
              <div className="prose-invert-zeph">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code(props) {
                      const { children, className, ...rest } = props;
                      const match = /language-(\w+)/.exec(className || "");
                      const isInline = !match && !String(children).includes("\n");
                      if (isInline) {
                        return (
                          <code className="rounded bg-white/[0.08] px-1.5 py-0.5 text-[13px]" {...rest}>
                            {children}
                          </code>
                        );
                      }
                      return (
                        <CodeBlock language={match?.[1] ?? "text"}>
                          {String(children).replace(/\n$/, "")}
                        </CodeBlock>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        )}

        {!isEditing && (
          <div
            className={cn(
              "flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100",
              isUser && "flex-row-reverse"
            )}
          >
            {isUser ? (
              <ActionButton icon={Pencil} label="Edit" onClick={() => setIsEditing(true)} />
            ) : (
              <>
                <ActionButton
                  icon={copied ? Check : Copy}
                  label="Copy"
                  onClick={handleCopy}
                  active={copied}
                />
                <ActionButton icon={RotateCcw} label="Retry" onClick={() => onRetry(message.id)} />
                <ActionButton
                  icon={ThumbsUp}
                  label="Like"
                  onClick={() => onReact(message.id, "like")}
                  active={message.reaction === "like"}
                />
                <ActionButton
                  icon={ThumbsDown}
                  label="Dislike"
                  onClick={() => onReact(message.id, "dislike")}
                  active={message.reaction === "dislike"}
                />
                <ActionButton
                  icon={Bookmark}
                  label="Bookmark"
                  onClick={() => onBookmark(message.id)}
                  active={message.bookmarked}
                />
                <ActionButton icon={Share2} label="Share" onClick={handleShare} />
              </>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  active,
}: {
  icon: typeof Copy;
  label: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "focus-ring flex h-6.5 w-6.5 items-center justify-center rounded-md transition-colors",
        active ? "text-white bg-white/[0.12]" : "text-white/35 hover:bg-white/[0.08] hover:text-white/80"
      )}
      aria-label={label}
    >
      <Icon size={13} fill={active && (label === "Like" || label === "Dislike" || label === "Bookmark") ? "currentColor" : "none"} />
    </button>
  );
}
