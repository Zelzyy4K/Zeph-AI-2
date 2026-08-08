import { motion } from "framer-motion";
import { SUGGESTIONS } from "@/constants/suggestions";
import { useGreeting } from "@/hooks/useGreeting";

interface LandingProps {
  onPromptSelect: (prompt: string) => void;
}

export function Landing({ onPromptSelect }: LandingProps) {
  const greeting = useGreeting();

  return (
    <div className="flex h-full flex-col items-center justify-center overflow-y-auto px-6 py-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center"
      >
        <p className="mb-1.5 text-[13px] font-medium text-white/40">{greeting}</p>
        <h1 className="text-[26px] font-bold tracking-tight text-white/95 sm:text-[30px]">
          How can Zeph AI help you today?
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="mt-10 grid w-full max-w-3xl grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4"
      >
        {SUGGESTIONS.slice(0, 8).map((s) => (
          <button
            key={s.id}
            onClick={() => onPromptSelect(s.prompt)}
            className="focus-ring group flex flex-col items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 text-left transition-colors hover:border-white/[0.14] hover:bg-white/[0.05]"
          >
            <s.icon size={17} className="text-white/50 transition-colors group-hover:text-white/85" />
            <span className="text-[13px] font-medium text-white/75 transition-colors group-hover:text-white/95">
              {s.label}
            </span>
          </button>
        ))}
      </motion.div>
    </div>
  );
}
