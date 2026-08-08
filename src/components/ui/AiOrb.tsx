import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface AiOrbProps {
  active?: boolean;
  size?: number;
  className?: string;
}

/**
 * The AI Orb is Zeph's signature element — a small glass sphere that
 * glows and breathes gently whenever the assistant is processing.
 */
export function AiOrb({ active = false, size = 22, className }: AiOrbProps) {
  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.95), rgba(255,255,255,0.25) 45%, rgba(255,255,255,0.05) 75%)",
          boxShadow: active
            ? "0 0 18px 2px rgba(255,255,255,0.35), inset 0 0 6px rgba(255,255,255,0.4)"
            : "0 0 6px 0px rgba(255,255,255,0.12), inset 0 0 4px rgba(255,255,255,0.2)",
          border: "1px solid rgba(255,255,255,0.25)",
        }}
        animate={
          active
            ? { scale: [1, 1.12, 1], opacity: [0.85, 1, 0.85] }
            : { scale: 1, opacity: 0.7 }
        }
        transition={
          active
            ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.3 }
        }
      />
    </div>
  );
}
